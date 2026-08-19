import pandas as pd
import numpy as np

class DataPreprocessor:
    def transform(self, data: dict):
        df = pd.DataFrame([data])
        return df
