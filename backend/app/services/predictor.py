from typing import Dict, List, Any, Optional
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import base64
import io
import shap
import json
from pathlib import Path
from app.core.globals import get_model, get_dataset, get_cached_data

class UFCPredictor:
    """Service class for UFC fight predictions using your optimized prediction logic with SHAP visualization."""
    
    def __init__(self):
        # Get models and datasets from global state
        self.loaded_model = get_model('main')
        self.p1_model = get_model('p1_method')
        self.p2_model = get_model('p2_method')
        
        self.cleaned_df = get_dataset('ufc_data')
        self.fighters_df = get_dataset('fighters')
        
        # Get cached data
        cached = get_cached_data()
        self.referee_counts_cache = cached['referee_counts_cache']
        self.fighter_lookup = cached['fighter_lookup']
    
    def reorder_features_to_model(self, model, input_df):
        """Reorder dataframe columns to match the order expected by the model"""
        model_feature_names = model.get_booster().feature_names
        
        missing_features = [f for f in model_feature_names if f not in input_df.columns]
        if missing_features:
            raise ValueError(f"Input dataframe is missing features required by the model: {missing_features}")
        
        return input_df[model_feature_names]
    
    def get_fighter_data(self, fighter_name):
        """Get fighter data with O(1) lookup"""
        if fighter_name not in self.fighter_lookup:
            raise ValueError(f"Fighter not found: {fighter_name}")
        return self.fighter_lookup[fighter_name]
    
    def calculate_fighter_record(self, fighter_name, event_date=None):
        """Calculate fighter's win/loss record more efficiently"""
        p1_mask = self.cleaned_df['p1_fighter'] == fighter_name
        p2_mask = self.cleaned_df['p2_fighter'] == fighter_name
        
        if event_date is not None:
            date_mask = self.cleaned_df['event_date'] < event_date
            p1_mask = p1_mask & date_mask
            p2_mask = p2_mask & date_mask
        
        p1_fights = self.cleaned_df[p1_mask]
        p2_fights = self.cleaned_df[p2_mask]
        
        wins = len(p1_fights[p1_fights['winner'] == 1]) + len(p2_fights[p2_fights['winner'] == 0])
        losses = len(p1_fights[p1_fights['winner'] == 0]) + len(p2_fights[p2_fights['winner'] == 1])
        
        return wins, losses, wins + losses
    
    def calculate_win_streak(self, fighter_name, event_date):
        """Calculate current win streak more efficiently"""
        fighter_mask = (self.cleaned_df['p1_fighter'] == fighter_name) | (self.cleaned_df['p2_fighter'] == fighter_name)
        date_mask = self.cleaned_df['event_date'] < event_date
        
        past_fights = self.cleaned_df[fighter_mask & date_mask].sort_values('event_date', ascending=False)
        
        win_streak = 0
        for _, fight in past_fights.iterrows():
            is_winner = ((fight['p1_fighter'] == fighter_name and fight['winner'] == 1) or 
                        (fight['p2_fighter'] == fighter_name and fight['winner'] == 0))
            if is_winner:
                win_streak += 1
            else:
                break
        
        return win_streak
    
    def calculate_days_since_last_fight(self, fighter_name, event_date):
        """Calculate days since last fight more efficiently"""
        fighter_mask = (self.cleaned_df['p1_fighter'] == fighter_name) | (self.cleaned_df['p2_fighter'] == fighter_name)
        date_mask = self.cleaned_df['event_date'] < event_date
        
        past_fights = self.cleaned_df[fighter_mask & date_mask]
        if past_fights.empty:
            return None
        
        last_fight_date = past_fights['event_date'].max()
        return (event_date - last_fight_date).days
    
    def calculate_ema_features(self, fighter_name, event_date):
        """Calculate EMA features more efficiently"""
        features = [
            'KD', 'SIG_STR_PCT', 'TD_PCT', 'SUB_ATT', 'REV', 'CTRL',
            'R1_KD', 'R1_SIG_STR_PCT', 'R1_TD_PCT', 'R1_SUB_ATT', 'R1_REV', 'R1_CTRL',
            'SIG_STR_PCT_DETAILED', 'R1_SIG_STR_PCT_DETAILED',
            'SIG_STR_LANDED', 'SIG_STR_ATTEMPTED', 'TOTAL_STR_LANDED', 'TOTAL_STR_ATTEMPTED',
            'TD_LANDED', 'TD_ATTEMPTED',
            'R1_SIG_STR_LANDED', 'R1_SIG_STR_ATTEMPTED', 'R1_TOTAL_STR_LANDED', 'R1_TOTAL_STR_ATTEMPTED',
            'R1_TD_LANDED', 'R1_TD_ATTEMPTED',
            'HEAD_LANDED', 'HEAD_ATTEMPTED', 'BODY_LANDED', 'BODY_ATTEMPTED',
            'LEG_LANDED', 'LEG_ATTEMPTED',
            'DISTANCE_LANDED', 'DISTANCE_ATTEMPTED', 'CLINCH_LANDED', 'CLINCH_ATTEMPTED',
            'GROUND_LANDED', 'GROUND_ATTEMPTED',
            'R1_HEAD_LANDED', 'R1_HEAD_ATTEMPTED', 'R1_BODY_LANDED', 'R1_BODY_ATTEMPTED',
            'R1_LEG_LANDED', 'R1_LEG_ATTEMPTED',
            'R1_DISTANCE_LANDED', 'R1_DISTANCE_ATTEMPTED', 'R1_CLINCH_LANDED', 'R1_CLINCH_ATTEMPTED',
            'R1_GROUND_LANDED', 'R1_GROUND_ATTEMPTED'
        ]
        
        fighter_mask = (self.cleaned_df['p1_fighter'] == fighter_name) | (self.cleaned_df['p2_fighter'] == fighter_name)
        date_mask = self.cleaned_df['event_date'] < event_date
        
        prev_fights = self.cleaned_df[fighter_mask & date_mask].sort_values('event_date', ascending=False).head(3)
        
        emas = {}
        
        if not prev_fights.empty:
            feature_values = {feat: [] for feat in features}
            
            for _, fight in prev_fights.iterrows():
                position = 'p1' if fight['p1_fighter'] == fighter_name else 'p2'
                prefix = f'{position}_'
                
                for feat in features:
                    col_name = f"{prefix}{feat}"
                    if col_name in fight and not pd.isna(fight[col_name]):
                        feature_values[feat].append(pd.to_numeric(fight[col_name], errors='coerce'))
            
            for feat in features:
                values = feature_values[feat]
                if len(values) == 1:
                    emas[feat] = values[0]
                elif len(values) == 2:
                    emas[feat] = 0.6 * values[0] + 0.4 * values[1]
                elif len(values) >= 3:
                    emas[feat] = 0.5 * values[0] + 0.3 * values[1] + 0.2 * values[2]
                else:
                    emas[feat] = np.nan
        else:
            emas = {feat: np.nan for feat in features}
        
        return emas
    
    def calculate_method_wins(self, fighter_name, include_method_features):
        """Calculate method-specific wins more efficiently"""
        if not include_method_features:
            return {}
        
        method_mapping = {
            'Decision - Majority': 'Decision',
            'Decision - Split': 'Decision',
            'Decision - Unanimous': 'Decision',
            "TKO - Doctor's Stoppage": "KO/TKO",
            'Overturned': 'Other',
            'Could Not Continue': 'Other',
            'DQ': 'Other',
            'Other': 'Other'
        }
        
        temp_method = self.cleaned_df['method'].replace(method_mapping)
        
        win_mask = ((self.cleaned_df['p1_fighter'] == fighter_name) & (self.cleaned_df['winner'] == 1)) | \
                   ((self.cleaned_df['p2_fighter'] == fighter_name) & (self.cleaned_df['winner'] == 0))
        
        win_fights = temp_method[win_mask]
        
        method_categories = ['Decision', 'KO/TKO', 'Submission']
        method_wins = {method: (win_fights == method).sum() for method in method_categories}
        
        return method_wins
    
    def getData(self, p1, p2, eventDate, ref, include_method_features=False):
        """Your optimized data preparation function"""
        eventDate = pd.to_datetime(eventDate)
        
        # Get fighter data efficiently
        p1_data = self.get_fighter_data(p1)
        p2_data = self.get_fighter_data(p2)
        
        # Extract basic stats
        cols = ['height','weight','reach','SLpM','Str. Acc.', 'SApM','Str. Def','TD Avg.','TD Acc.','TD Def.','Sub. Avg.']
        f1 = np.array([p1_data[col] for col in cols], dtype=float)
        f2 = np.array([p2_data[col] for col in cols], dtype=float)

        # Calculate ages efficiently
        p1Age = (eventDate - p1_data['dob']).days / 365.25
        p2Age = (eventDate - p2_data['dob']).days / 365.25
        ageDiff = p1Age - p2Age

        # Calculate age adjusted stats
        age_adjust_cols = ['SLpM','Str. Acc.', 'SApM','Str. Def','TD Avg.','TD Acc.','TD Def.','Sub. Avg.']
        p1_age_adjusted = {col: p1_data[col] * (1/p1Age) for col in age_adjust_cols}
        p2_age_adjusted = {col: p2_data[col] * (1/p2Age) for col in age_adjust_cols}

        # Calculate days since last fight
        p1_days = self.calculate_days_since_last_fight(p1, eventDate)
        p2_days = self.calculate_days_since_last_fight(p2, eventDate)
        days_diff = (p1_days - p2_days) if (p1_days is not None and p2_days is not None) else None

        # Get stances and encode
        categories = ['Open Stance', 'Orthodox', 'Sideways', 'Southpaw', 'Switch']
        stance1 = [p1_data['stance'] == cat for cat in categories]
        stance2 = [p2_data['stance'] == cat for cat in categories]

        # Calculate records
        p1_wins, p1_losses, p1_total = self.calculate_fighter_record(p1, eventDate)
        p2_wins, p2_losses, p2_total = self.calculate_fighter_record(p2, eventDate)
        
        # Calculate win streaks
        p1_win_streak = self.calculate_win_streak(p1, eventDate)
        p2_win_streak = self.calculate_win_streak(p2, eventDate)

        # Get referee frequency from cache
        ref_counts = self.referee_counts_cache.get(ref, 0)

        # Calculate EMAs
        p1_emas = self.calculate_ema_features(p1, eventDate)
        p2_emas = self.calculate_ema_features(p2, eventDate)
        
        # Calculate method wins if needed
        p1_method_wins = self.calculate_method_wins(p1, include_method_features)
        p2_method_wins = self.calculate_method_wins(p2, include_method_features)

        # Build feature dictionary
        feature_dict = {
            'winner': np.nan,
            
            # Basic stats for fighter 1
            'p1_height': f1[0], 'p1_weight': f1[1], 'p1_reach': f1[2], 'p1_slpm': f1[3],
            'p1_str_acc': f1[4], 'p1_sapm': f1[5], 'p1_str_def': f1[6], 'p1_td_avg': f1[7],
            'p1_td_acc': f1[8], 'p1_td_def': f1[9], 'p1_sub_avg': f1[10],
            
            # Basic stats for fighter 2
            'p2_height': f2[0], 'p2_weight': f2[1], 'p2_reach': f2[2], 'p2_slpm': f2[3],
            'p2_str_acc': f2[4], 'p2_sapm': f2[5], 'p2_str_def': f2[6], 'p2_td_avg': f2[7],
            'p2_td_acc': f2[8], 'p2_td_def': f2[9], 'p2_sub_avg': f2[10],
            
            # Age and physical differences
            'p1_age_at_event': p1Age, 'p2_age_at_event': p2Age,
            'height_diff': f1[0] - f2[0], 'reach_diff': f1[1] - f2[1], 'weight_diff': f1[2] - f2[2],
            'age_diff': ageDiff,
            
            # Skill differences
            'slpm_diff': f1[3] - f2[3], 'stracc_diff': f1[4] - f2[4], 'sapm_diff': f1[5] - f2[5],
            'strdef_diff': f1[6] - f2[6], 'tdavg_diff': f1[7] - f2[7], 'tdacc_diff': f1[8] - f2[8],
            'tddef_diff': f1[9] - f2[9], 'subavg_diff': f1[10] - f2[10],
            
            # Time since last fight
            'p1_days_since_last_fight': p1_days, 'p2_days_since_last_fight': p2_days,
            'days_since_last_fight_diff': days_diff,
            
            # Fight records
            'p1_wins': p1_wins, 'p1_losses': p1_losses, 'p1_total': p1_total,
            'p2_wins': p2_wins, 'p2_losses': p2_losses, 'p2_total': p2_total,
            'win_diff': p1_wins - p2_wins, 'loss_diff': p1_losses - p2_losses,
            'total_diff': p1_total - p2_total, 'p1_win_streak': p1_win_streak, 'p2_win_streak': p2_win_streak,
            
            # Age adjusted stats
            'p1_age_adjusted_slpm': p1_age_adjusted['SLpM'],
            'p2_age_adjusted_slpm': p2_age_adjusted['SLpM'],
            'p1_age_adjusted_str_acc': p1_age_adjusted['Str. Acc.'],
            'p2_age_adjusted_str_acc': p2_age_adjusted['Str. Acc.'],
            'p1_age_adjusted_sapm': p1_age_adjusted['SApM'],
            'p2_age_adjusted_sapm': p2_age_adjusted['SApM'],
            'p1_age_adjusted_str_def': p1_age_adjusted['Str. Def'],
            'p2_age_adjusted_str_def': p2_age_adjusted['Str. Def'],
            'p1_age_adjusted_td_avg': p1_age_adjusted['TD Avg.'],
            'p2_age_adjusted_td_avg': p2_age_adjusted['TD Avg.'],
            'p1_age_adjusted_td_acc': p1_age_adjusted['TD Acc.'],
            'p2_age_adjusted_td_acc': p2_age_adjusted['TD Acc.'],
            'p1_age_adjusted_td_def': p1_age_adjusted['TD Def.'],
            'p2_age_adjusted_td_def': p2_age_adjusted['TD Def.'],
            'p1_age_adjusted_sub_avg': p1_age_adjusted['Sub. Avg.'],
            'p2_age_adjusted_sub_avg': p2_age_adjusted['Sub. Avg.'],
            
            # Referee frequency
            'referee_freq': ref_counts
        }
        
        # Add EMA features
        ema_features = list(p1_emas.keys())
        for feat in ema_features:
            feature_dict[f'p1_{feat.lower()}_ema'] = p1_emas[feat]
            feature_dict[f'p2_{feat.lower()}_ema'] = p2_emas[feat]
        
        # Add method-specific features if requested
        if include_method_features:
            feature_dict.update({
                'p1_decision_wins': p1_method_wins['Decision'],
                'p1_ko/tko_wins': p1_method_wins['KO/TKO'],
                'p1_submission_wins': p1_method_wins['Submission'],
                'p2_decision_wins': p2_method_wins['Decision'],
                'p2_ko/tko_wins': p2_method_wins['KO/TKO'],
                'p2_submission_wins': p2_method_wins['Submission'],
            })
        
        # Add stance encoding
        for i, stance_cat in enumerate(categories):
            feature_dict[f'p1_stance_{stance_cat}'] = stance1[i]
            feature_dict[f'p2_stance_{stance_cat}'] = stance2[i]
        
        return pd.DataFrame([feature_dict])
    
    def validate_features(self, input_features, target_model):
        """Validate features for method prediction models using exact 50 features"""
        try:
            feature_file_path = Path(f"data/{target_model}_features.json")
            
            if not feature_file_path.exists():
                raise FileNotFoundError(f"Feature file not found: {feature_file_path}")
            
            # Load the required features from JSON
            with open(feature_file_path, 'r') as f:
                feature_data = json.load(f)
                # Handle both dict and list formats
                if isinstance(feature_data, dict):
                    required_features = list(feature_data.keys())
                else:
                    required_features = feature_data
            
            print(f"Loaded {len(required_features)} features for {target_model}")
            
            # Check for missing features
            missing = [f for f in required_features if f not in input_features.columns]
            if missing:
                print(f"Missing features: {missing[:5]}...")  # Show first 5
                raise ValueError(f"Missing {len(missing)} required features for {target_model}")
            
            # Return only the required features in the correct order
            return input_features[required_features]
            
        except Exception as e:
            print(f"Error in validate_features: {e}")
            print(f"Feature file path: {feature_file_path}")
            print(f"File exists: {feature_file_path.exists()}")
            raise e  # Re-raise instead of falling back
    
    def get_winner_prediction(self, p1, p2, eventDate, ref):
        """Helper function to get winner prediction probabilities"""
        fight_features = self.getData(p1, p2, eventDate, ref, include_method_features=False)
        fight_features_numeric = fight_features.drop(columns=['winner']).astype(float)
        fight_features_numeric = self.reorder_features_to_model(self.loaded_model, fight_features_numeric)
        prediction = self.loaded_model.predict_proba(fight_features_numeric)
        
        p1_win_prob = float(prediction[0][1])
        p2_win_prob = float(prediction[0][0])
        predicted_winner = p1 if p1_win_prob > p2_win_prob else p2
        
        return p1_win_prob, p2_win_prob, predicted_winner
    
    def get_method_percentages(self, p1, p2, eventDate, ref):
        """Helper function to get method-specific percentages"""
        try:
            fight_features = self.getData(p1, p2, eventDate, ref, include_method_features=True)
            
            print(f"Generated features shape: {fight_features.shape}")
            print(f"Feature columns: {len(fight_features.columns)}")
            
            # Validate features for both models
            p1_features = self.validate_features(fight_features, 'p1_method')
            p2_features = self.validate_features(fight_features, 'p2_method')
            
            print(f"P1 features after validation: {p1_features.shape}")
            print(f"P2 features after validation: {p2_features.shape}")
            
            # Make predictions
            p1_probs = self.p1_model.predict_proba(p1_features).flatten()
            p2_probs = self.p2_model.predict_proba(p2_features).flatten()
            
            class_names = ['Decision', 'KO/TKO', 'Submission']
            
            p1_methods_sorted = sorted(zip(class_names, p1_probs * 100), key=lambda x: x[1], reverse=True)
            p2_methods_sorted = sorted(zip(class_names, p2_probs * 100), key=lambda x: x[1], reverse=True)
            
            p1_method_percentages = [f"{method}: {percent:.1f}%" for method, percent in p1_methods_sorted]
            p2_method_percentages = [f"{method}: {percent:.1f}%" for method, percent in p2_methods_sorted]
            
            return p1_method_percentages, p2_method_percentages
            
        except Exception as e:
            print(f"Error in get_method_percentages: {e}")
            raise e
    
    def create_optimized_shap_visualization_base64(self, p1_name, p2_name, event_date, referee):
        """
        Creates your optimized SHAP visualization and returns as base64 string for React frontend
        """
        try:
            fight_data = self.getData(p1_name, p2_name, event_date, referee, include_method_features=False)
            fight_features = fight_data.drop(columns=['winner']).astype(float)
            fight_features_reordered = self.reorder_features_to_model(self.loaded_model, fight_features)
            
            # Get SHAP values
            explainer = shap.Explainer(self.loaded_model)
            shap_explanation = explainer(fight_features_reordered)
            single_explanation = shap_explanation[0]

            if hasattr(single_explanation.values, 'shape') and len(single_explanation.values.shape) > 1:
                shap_values = single_explanation.values[:, 1]
            else:
                shap_values = single_explanation.values
            
            # INCREASED THRESHOLD to filter out very small impact features
            MIN_THRESHOLD = 0.025
            
            # Create feature mapping for combining p1/p2 stats
            combined_features = {}
            other_features = []
            other_shap_sum = 0
            processed_features = set()
            
            # Define stat categories to combine
            stat_categories = {
                'slpm': 'Striking Volume',
                'str_acc': 'Striking Accuracy', 
                'sapm': 'Striking Absorbed',
                'str_def': 'Striking Defense',
                'td_avg': 'Takedown Average',
                'td_acc': 'Takedown Accuracy',
                'td_def': 'Takedown Defense',
                'sub_avg': 'Submission Average',
                'age_adjusted_str_acc': 'Age Adj Str Accuracy',
                'age_adjusted_str_def': 'Age Adj Str Defense',
                'age_adjusted_td_acc': 'Age Adj TD Accuracy',
                'age_adjusted_td_def': 'Age Adj TD Defense',
                'age_adjusted_sub_avg': 'Age Adj Sub Average'
            }
            
            # Combine p1/p2 stats for Individual Skills
            for base_stat, display_name in stat_categories.items():
                p1_col = f'p1_{base_stat}'
                p2_col = f'p2_{base_stat}'
                
                p1_idx = None
                p2_idx = None
                
                for i, col in enumerate(fight_features_reordered.columns):
                    if col == p1_col:
                        p1_idx = i
                    elif col == p2_col:
                        p2_idx = i
                
                if p1_idx is not None and p2_idx is not None:
                    combined_shap = shap_values[p1_idx] + shap_values[p2_idx]
                    
                    if abs(combined_shap) > MIN_THRESHOLD:
                        p1_val = fight_features_reordered.iloc[0, p1_idx]
                        p2_val = fight_features_reordered.iloc[0, p2_idx]
                        
                        combined_features[display_name] = {
                            'shap_value': combined_shap,
                            'p1_value': p1_val,
                            'p2_value': p2_val,
                            'category': 'Individual Skills'
                        }
                        
                        processed_features.add(p1_col)
                        processed_features.add(p2_col)
            
            # Combine Physical Attributes
            physical_combinations = [
                ('p1_age_at_event', 'p2_age_at_event', 'Age'),
                ('p1_reach', 'p2_reach', 'Reach'), 
                ('p1_height', 'p2_height', 'Height'),
                ('p1_weight', 'p2_weight', 'Weight')
            ]
            
            for p1_col, p2_col, display_name in physical_combinations:
                p1_idx = None
                p2_idx = None
                
                for i, col in enumerate(fight_features_reordered.columns):
                    if col == p1_col:
                        p1_idx = i
                    elif col == p2_col:
                        p2_idx = i
                
                if p1_idx is not None and p2_idx is not None:
                    combined_shap = shap_values[p1_idx] + shap_values[p2_idx]
                    
                    if abs(combined_shap) > MIN_THRESHOLD:
                        p1_val = fight_features_reordered.iloc[0, p1_idx]
                        p2_val = fight_features_reordered.iloc[0, p2_idx]
                        
                        combined_features[display_name] = {
                            'shap_value': combined_shap,
                            'p1_value': p1_val,
                            'p2_value': p2_val,
                            'category': 'Physical Attributes'
                        }
                        
                        processed_features.add(p1_col)
                        processed_features.add(p2_col)
            
            # Combine Experience & Records
            experience_combinations = [
                ('p1_wins', 'p2_wins', 'Wins'),
                ('p1_losses', 'p2_losses', 'Losses'),
                ('p1_total', 'p2_total', 'Total Fights'),
                ('p1_win_streak', 'p2_win_streak', 'Win Streak'),
                ('p1_days_since_last_fight', 'p2_days_since_last_fight', 'Days Since Last Fight')
            ]
            
            for p1_col, p2_col, display_name in experience_combinations:
                p1_idx = None
                p2_idx = None
                
                for i, col in enumerate(fight_features_reordered.columns):
                    if col == p1_col:
                        p1_idx = i
                    elif col == p2_col:
                        p2_idx = i
                
                if p1_idx is not None and p2_idx is not None:
                    combined_shap = shap_values[p1_idx] + shap_values[p2_idx]
                    
                    if abs(combined_shap) > MIN_THRESHOLD:
                        p1_val = fight_features_reordered.iloc[0, p1_idx]
                        p2_val = fight_features_reordered.iloc[0, p2_idx]
                        
                        combined_features[display_name] = {
                            'shap_value': combined_shap,
                            'p1_value': p1_val,
                            'p2_value': p2_val,
                            'category': 'Experience & Records'
                        }
                        
                        processed_features.add(p1_col)
                        processed_features.add(p2_col)
            
            # Process remaining features
            for i, feature in enumerate(fight_features_reordered.columns):
                if feature in processed_features:
                    continue
                    
                # Skip excluded features
                if feature in ['age_diff', 'days_since_last_fight_diff']:
                    continue
                
                shap_val = shap_values[i]
                if abs(shap_val) > MIN_THRESHOLD:
                    
                    # Categorize remaining features
                    category = 'Other'
                    if '_diff' in feature:
                        category = 'Fighter Differences'
                    elif 'stance_' in feature:
                        category = 'Fighting Style'
                    elif feature == 'referee_freq':
                        category = 'Context & Other'
                    elif '_ema' in feature:
                        category = 'Context & Other'
                    
                    if category == 'Other' or category == 'Context & Other':
                        # Sum up miscellaneous features
                        other_shap_sum += shap_val
                    else:
                        clean_name = feature.replace('_diff', ' Difference').replace('_', ' ').title()
                        clean_name = clean_name.replace('p1 ', f'{p1_name} ').replace('p2 ', f'{p2_name} ')
                        
                        other_features.append({
                            'name': clean_name,
                            'shap_value': shap_val,
                            'value': fight_features_reordered.iloc[0, i],
                            'category': category
                        })
            
            # Group features by category
            all_features_by_category = {
                'Fighter Differences': [],
                'Individual Skills': [],
                'Physical Attributes': [],
                'Experience & Records': [],
                'Fighting Style': [],
                'Context & Other': []
            }
            
            # Add combined features
            for name, data in combined_features.items():
                all_features_by_category[data['category']].append({
                    'name': name,
                    'shap_value': data['shap_value'],
                    'category': data['category'],
                    'type': 'combined',
                    'p1_value': data['p1_value'],
                    'p2_value': data['p2_value']
                })
            
            # Add other features
            for feature in other_features:
                all_features_by_category[feature['category']].append({
                    'name': feature['name'],
                    'shap_value': feature['shap_value'],
                    'category': feature['category'],
                    'type': 'individual'
                })
            
            # Add the combined "Context & Other" bar if meaningful
            if abs(other_shap_sum) > MIN_THRESHOLD:
                all_features_by_category['Context & Other'].append({
                    'name': 'Context & Other',
                    'shap_value': other_shap_sum,
                    'category': 'Context & Other',
                    'type': 'combined'
                })
            
            # Sort each category and take top features per category
            final_features = []
            category_colors = {
                'Fighter Differences': '#FF6B6B',
                'Individual Skills': '#4ECDC4',
                'Physical Attributes': '#96CEB4',
                'Experience & Records': '#FFEAA7',
                'Fighting Style': '#DDA0DD',
                'Context & Other': '#FFA07A'
            }
            
            # Limit features per category to prevent overcrowding
            category_limits = {
                'Fighter Differences': 6,
                'Individual Skills': 5,
                'Physical Attributes': 3,
                'Experience & Records': 3,
                'Fighting Style': 2,
                'Context & Other': 1
            }
            
            # Build the final ordered list GROUPED BY CATEGORY
            for category in ['Fighter Differences', 'Individual Skills', 'Physical Attributes',
                             'Experience & Records', 'Fighting Style', 'Context & Other']:
                category_features = all_features_by_category[category]
                if category_features:
                    # Sort within category by absolute SHAP value
                    category_features.sort(key=lambda x: abs(x['shap_value']), reverse=True)
                    limit = category_limits[category]
                    final_features.extend(category_features[:limit])
            
            # Take top 16 overall but maintain category grouping
            if len(final_features) > 16:
                # Proportionally reduce from each category
                temp_features = []
                for category in ['Fighter Differences', 'Individual Skills', 'Physical Attributes',
                                 'Experience & Records', 'Fighting Style', 'Context & Other']:
                    cat_features = [f for f in final_features if f['category'] == category]
                    if cat_features:
                        # Take proportional amount, minimum 1 per category
                        proportion = max(1, int(len(cat_features) * 16 / len(final_features)))
                        temp_features.extend(cat_features[:proportion])
                final_features = temp_features[:16]
            
            # Create the plot with proper margins
            plt.style.use('dark_background')
            fig, ax = plt.subplots(figsize=(16, 10))
            fig.patch.set_facecolor('#121212')
            
            feature_names = [f['name'] for f in final_features]
            shap_vals = [f['shap_value'] for f in final_features]
            categories = [f['category'] for f in final_features]
            colors = [category_colors[cat] for cat in categories]
            
            # Create bars
            y_pos = np.arange(len(feature_names))
            bars = ax.barh(y_pos, shap_vals, color=colors, alpha=0.8, edgecolor='white', linewidth=0.5)
            
            # Customize the plot
            ax.set_yticks(y_pos)
            ax.set_yticklabels(feature_names, fontsize=11, color='white')
            ax.invert_yaxis()
            ax.set_xlabel('SHAP Impact', color='white', fontsize=14, fontweight='bold')
            ax.axvline(0, color='white', linewidth=2, alpha=0.8)
            
            # REMOVE ALL GRID LINES
            ax.grid(False)
            
            ax.set_facecolor('#121212')
            
            # Set x-axis increments to 0.1
            x_min, x_max = ax.get_xlim()
            # Extend range to nearest 0.1 increments
            x_min_rounded = np.floor(x_min * 10) / 10
            x_max_rounded = np.ceil(x_max * 10) / 10
            
            # Add margin for text
            margin = 0.05
            x_min_rounded -= margin
            x_max_rounded += margin
            
            ax.set_xlim(x_min_rounded, x_max_rounded)
            
            # Set x-axis ticks to 0.1 increments
            x_ticks = np.arange(x_min_rounded, x_max_rounded + 0.1, 0.1)
            ax.set_xticks(x_ticks)
            
            # Add light grey vertical lines at every OTHER increment
            for i, tick in enumerate(x_ticks):
                if tick != 0 and i % 2 == 0:  # Every other increment, skipping 0
                    ax.axvline(tick, color='lightgrey', linewidth=0.5, alpha=0.3)
            
            # Add clear direction indicators
            ax.text(0.02, 1.02, f'← Favors {p2_name}', transform=ax.transAxes, 
                    color='#4444FF', fontsize=14, fontweight='bold', va='bottom')
            ax.text(0.98, 1.02, f'Favors {p1_name} →', transform=ax.transAxes, 
                    color='#FF4444', fontsize=14, fontweight='bold', va='bottom', ha='right')
            
            # Add value labels with better positioning
            x_min, x_max = ax.get_xlim()
            x_range = x_max - x_min
            safe_margin = x_range * 0.02  # 2% safe margin from edges
            
            for i, (bar, val) in enumerate(zip(bars, shap_vals)):
                if val > 0:
                    label_x = val + 0.003
                    if label_x > x_max - safe_margin:
                        label_x = x_max - safe_margin
                    ha = 'left'
                else:
                    label_x = val - 0.003
                    if label_x < x_min + safe_margin:
                        label_x = x_min + safe_margin
                    ha = 'right'
                    
                ax.text(label_x, bar.get_y() + bar.get_height()/2, f'{val:.3f}', 
                       ha=ha, va='center', color='white', fontsize=10, fontweight='bold')
            
            # Add horizontal lines between categories
            current_category = None
            separator_positions = []
            
            for i, cat in enumerate(categories):
                if cat != current_category:
                    if current_category is not None:
                        separator_positions.append(i - 0.5)
                    current_category = cat
            
            # Draw the separator lines
            for sep_pos in separator_positions:
                ax.axhline(y=sep_pos, color='white', linewidth=1, alpha=0.7)
            
            # Get prediction info
            prediction = self.loaded_model.predict_proba(fight_features_reordered)
            p1_prob = prediction[0][1]
            predicted_winner = p1_name if p1_prob > 0.5 else p2_name
            
            # Add title
            ax.set_title(f'SHAP Feature Analysis: {p1_name} vs {p2_name}\nPredicted Winner: {predicted_winner} ({max(p1_prob, 1-p1_prob):.1%}', color='white', fontsize=16, fontweight='bold', pad=25)
            
            # Create legend for categories
            from matplotlib.patches import Patch
            legend_elements = []
            seen_categories = []
            for cat in categories:
                if cat not in seen_categories:
                    legend_elements.append(Patch(facecolor=category_colors[cat], label=cat))
                    seen_categories.append(cat)
            
            ax.legend(handles=legend_elements, loc='lower right', facecolor='#121212', 
                     edgecolor='white', fontsize=13)
            
            ax.tick_params(colors='white')
            
            # Enhanced margins to prevent text cutoff
            plt.tight_layout()
            plt.subplots_adjust(top=0.88, left=0.25, right=0.92, bottom=0.08)
            
            # Convert to base64
            buffer = io.BytesIO()
            plt.savefig(buffer, format='png', facecolor='#121212', dpi=150, bbox_inches='tight')
            buffer.seek(0)
            image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
            plt.close()
            
            return f"data:image/png;base64,{image_base64}"
            
        except Exception as e:
            print(f"Error generating SHAP plot: {str(e)}")
            return None
    
    def combined_predict(self, p1, p2, eventDate, ref, prediction_type='winner'):
        """Main prediction function matching your original API"""
        # Get winner prediction
        p1_win_prob, p2_win_prob, predicted_winner = self.get_winner_prediction(p1, p2, eventDate, ref)
        
        result = {
            'fight_type': 'Winner Prediction' if prediction_type == 'winner' else 'Method Prediction',
            'fighter_1_name': p1,
            'fighter_1_win_percentage': f"{p1_win_prob * 100:.1f}%",
            'fighter_2_name': p2,
            'fighter_2_win_percentage': f"{p2_win_prob * 100:.1f}%",
            'predicted_winner': predicted_winner,
            'event_date': eventDate,
            'referee': ref
        }
        
        if prediction_type == 'method':
            # Get method-specific percentages
            p1_method_percentages, p2_method_percentages = self.get_method_percentages(p1, p2, eventDate, ref)
            result['fighter_1_method_percentages'] = p1_method_percentages
            result['fighter_2_method_percentages'] = p2_method_percentages
        
        return result
    
    def combined_predict_with_shap(self, p1, p2, eventDate, ref, prediction_type='winner'):
        """Enhanced prediction function that includes SHAP visualization"""
        # Get basic prediction
        result = self.combined_predict(p1, p2, eventDate, ref, prediction_type)
        
        # Add SHAP plot
        shap_plot = self.create_optimized_shap_visualization_base64(p1, p2, eventDate, ref)
        if shap_plot:
            result['shap_plot'] = shap_plot
        
        return result
