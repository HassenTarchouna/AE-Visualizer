"""
Scheduler algorithms for single-machine ordering to minimize total completion time.
We assume input: list of tasks with durations [p1, p2, ...]
A permutation solution is an ordering of tasks; cost = sum of completion times.
"""

import random
import numpy as np
from typing import List, Tuple

def total_completion_time(order: List[int], durations: List[float]) -> float:
    """Given a permutation 'order' of indices, compute sum of completion times."""
    time = 0.0
    total = 0.0
    for idx in order:
        time += durations[idx]
        total += time
    return total

def generate_swap_neighbors(order):
    n = len(order)
    neighbors = []
    for i in range(n):
        for j in range(i+1, n):
            nb = order.copy()
            nb[i], nb[j] = nb[j], nb[i]
            neighbors.append(nb)
    return neighbors

def tabu_search(durations, n_iterations=500, tabu_size=50):
    n = len(durations)
    current = list(range(n))
    random.shuffle(current)
    best = current.copy()
    best_cost = total_completion_time(best, durations)
    from collections import deque
    tabu = deque(maxlen=tabu_size)
    history = []

    for it in range(n_iterations):
        neighbors = generate_swap_neighbors(current)
        feasible = [v for v in neighbors if v not in tabu]
        if not feasible:
            break
        costs = [total_completion_time(v, durations) for v in feasible]
        idx = int(np.argmin(costs))
        current = feasible[idx]
        current_cost = costs[idx]

        #  Use consistent property names
        history.append({
            "iter": it,
            "current_solution": current.copy(),  
            "current_cost": current_cost,
            "best_solution": best.copy(),        
            "best_cost": best_cost,
            "durations": durations  # Add durations for frontend visualization
        })

        tabu.append(tuple(current))  # Store as tuple for hashability
        if current_cost < best_cost:
            best = current.copy()
            best_cost = current_cost

    return best, best_cost, history

def simulated_annealing(durations, n_iterations=1000, init_temp=1000.0, cooling_rate=0.995):
    n = len(durations)
    current = list(range(n))
    random.shuffle(current)
    current_cost = total_completion_time(current, durations)
    best = current.copy()
    best_cost = current_cost
    history = []
    T = init_temp

    for it in range(n_iterations):
        i, j = random.sample(range(n), 2)
        new = current.copy()
        new[i], new[j] = new[j], new[i]
        new_cost = total_completion_time(new, durations)
        delta = new_cost - current_cost
        accept = False
        if delta < 0 or random.random() < np.exp(-delta / max(T, 1e-9)):
            accept = True

        if accept:
            current = new
            current_cost = new_cost

        if current_cost < best_cost:
            best = current.copy()
            best_cost = current_cost

        # Use consistent property names
        history.append({
            "iter": it,
            "current_solution": current.copy(),  # Changed from candidate_solution
            "current_cost": current_cost,        # Changed from candidate_cost
            "best_solution": best.copy(),
            "best_cost": best_cost,
            "temperature": T,
            "durations": durations  # Add durations for frontend
        })
        T *= cooling_rate

    return best, best_cost, history

# GA implementation for scheduler
def ga_scheduler(durations, population_size=50, generations=200, selection="roulette", crossover="one-point", mutation_rate=0.05):
    """Genetic Algorithm for scheduler problem."""
    n = len(durations)
    
    def fitness(solution):
        return 1.0 / (total_completion_time(solution, durations) + 1e-9)
    
    # Create initial population
    pop = [random.sample(range(n), n) for _ in range(population_size)]
    history = []
    
    for gen in range(generations):
        # Fitness calculation
        fits = [fitness(ind) for ind in pop]
        
        # Selection
        if selection == "roulette":
            total_fit = sum(fits)
            probs = [f/total_fit for f in fits]
            selected = []
            for _ in range(population_size):
                r = random.random()
                cum = 0.0
                for i, p in enumerate(probs):
                    cum += p
                    if r <= cum:
                        selected.append(pop[i].copy())
                        break
                else:
                    selected.append(pop[-1].copy())
        else:  # rank selection
            ranked = sorted(pop, key=lambda x: total_completion_time(x, durations))
            ranks = list(range(1, population_size + 1))
            total_rank = sum(ranks)
            probs = [r/total_rank for r in ranks[::-1]]
            selected = []
            for _ in range(population_size):
                r = random.random()
                cum = 0.0
                for i, p in enumerate(probs):
                    cum += p
                    if r <= cum:
                        selected.append(ranked[i].copy())
                        break
                else:
                    selected.append(ranked[-1].copy())
        
        # Crossover
        new_pop = []
        for i in range(0, population_size, 2):
            p1 = selected[i]
            p2 = selected[(i + 1) % population_size]
            
            if crossover == "one-point":
                point = random.randint(1, n-1)
                c1 = p1[:point] + [x for x in p2 if x not in p1[:point]]
                c2 = p2[:point] + [x for x in p1 if x not in p2[:point]]
            elif crossover == "two-points":
                points = sorted(random.sample(range(1, n), 2))
                c1 = p1[:points[0]] + [x for x in p2 if x not in p1[:points[0]] and x not in p1[points[1]:]]
                c2 = p2[:points[0]] + [x for x in p1 if x not in p2[:points[0]] and x not in p2[points[1]:]]
            else:  # uniform
                c1, c2 = [], []
                for j in range(n):
                    if random.random() < 0.5:
                        c1.append(p1[j])
                        c2.append(p2[j])
                    else:
                        c1.append(p2[j])
                        c2.append(p1[j])
                # Repair duplicates
                c1 = list(dict.fromkeys(c1 + [x for x in p1 if x not in c1]))
                c2 = list(dict.fromkeys(c2 + [x for x in p2 if x not in c2]))
            
            new_pop.extend([c1, c2])
        
        # Mutation
        for ind in new_pop:
            if random.random() < mutation_rate:
                i, j = random.sample(range(n), 2)
                ind[i], ind[j] = ind[j], ind[i]
        
        pop = new_pop
        
        # Track best
        best_ind = min(pop, key=lambda x: total_completion_time(x, durations))
        best_cost = total_completion_time(best_ind, durations)
        history.append({
            "iter": gen,
            "current_solution": best_ind.copy(),
            "current_cost": best_cost,
            "best_solution": best_ind.copy(),
            "best_cost": best_cost,
            "durations": durations
        })
    
    best_ind = min(pop, key=lambda x: total_completion_time(x, durations))
    best_cost = total_completion_time(best_ind, durations)
    return best_ind, best_cost, history