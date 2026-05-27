import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

#----------Get data out of dataset----------#
data1 = pd.read_csv("matches.csv")
data2 = pd.read_csv("deliveries.csv")

print(data1.head())
print(data2.head())

print(data1.isnull().sum())

sns.heatmap(data1.isnull(), cmap="spring")
plt.show()

#----------Clean dataset1----------#
data1.drop(["umpire3"], axis=1, inplace=True)
data1.dropna(inplace=True)
print(data1.isnull().sum())

#repeat for dataset2
print(data2.isnull().sum())
sns.heatmap(data2.isnull(), cmap="spring")
plt.show()
data2.dropna(inplace=True)
print(data2.isnull().sum())