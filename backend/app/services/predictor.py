from typing import Dict, List, Any, Optional
import pandas as pd
import numpy as np
from pathlib import Path
from app.core.globals import get_model, get_dataset, get_cached_data

class UFCPredictor:
    """Service class for UFC fight predictions using your optimized prediction logic."""
    
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

        # Build feature dictionary (same as your original code)
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
        """Validate features for method prediction models"""
        # For now, assume all features are available - you may need to add the JSON files
        # or implement feature selection logic based on your model requirements
        try:
            feature_file_path = Path(f"data/{target_model}_features.json")
            if feature_file_path.exists():
                required_features = pd.read_json(feature_file_path, typ='series').tolist()
                missing = [f for f in required_features if f not in input_features]
                if missing:
                    raise ValueError(f"Missing required features: {missing}")
                return input_features[required_features]
            else:
                # Fallback: return all available features
                return input_features.drop(columns=['winner'], errors='ignore')
        except Exception as e:
            # If validation fails, return all features except winner
            return input_features.drop(columns=['winner'], errors='ignore')
    
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
        fight_features = self.getData(p1, p2, eventDate, ref, include_method_features=True)
        
        p1_features = self.validate_features(fight_features, 'p1_method_target')
        p2_features = self.validate_features(fight_features, 'p2_method_target')
        
        p1_probs = self.p1_model.predict_proba(p1_features).flatten()
        p2_probs = self.p2_model.predict_proba(p2_features).flatten()
        
        class_names = ['Decision', 'KO/TKO', 'Submission']
        
        p1_methods_sorted = sorted(zip(class_names, p1_probs * 100), key=lambda x: x[1], reverse=True)
        p2_methods_sorted = sorted(zip(class_names, p2_probs * 100), key=lambda x: x[1], reverse=True)
        
        p1_method_percentages = [f"{method}: {percent:.1f}%" for method, percent in p1_methods_sorted]
        p2_method_percentages = [f"{method}: {percent:.1f}%" for method, percent in p2_methods_sorted]
        
        return p1_method_percentages, p2_method_percentages
    
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
