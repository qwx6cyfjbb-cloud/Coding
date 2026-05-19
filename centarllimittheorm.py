import numpy as np

heights = np.random.uniform(150, 200, 1000)
average_heights = [np.mean(np.random.choice(heights, 30)) for _ in range(1000)] 
print("Average height distribution:", np.mean(average_heights), np.std(average_heights))

scores = np.random.uniform(0, 100, 1000)
average_scores = [np.mean(np.random.choice(scores, 30)) for _ in range(1000)] 
print("Average score distribution:", np.mean(average_scores), np.std(average_scores))

weights = np.random.uniform(1, 100, 1000) 
average_weights = [np.mean(np.random.choice(weights, 30)) for _ in range(1000)]
print("Average weight distribution:", np.mean(average_weights), np.std(average_weights))

times = np.random.uniform(1, 60, 1000) 
average_times = [np.mean(np.random.choice(times, 30)) for _ in range(1000)] 
print("Average time distribution:", np.mean(average_times), np.std(average_times))

customers = np.random.poisson(20, 1000)
average_customers = [np.mean(np.random.choice(customers, 30)) for _ in range(1000)] 
print("Average number of customers distribution:", np.mean(average_customers), np.std(average_customers))