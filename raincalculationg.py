import scipy.stats as stats

prob1 = 1-stats.poisson.cdf(20, 15)

print(prob1)

prob2 = stats.poisson.cdf(20, 18) - stats.poisson.cdf(10, 18)
print(prob2)