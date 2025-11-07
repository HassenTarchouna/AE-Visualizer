"""
You'll find bellow every algorithm for Travler salesman problem 
TSP algorithms:
 - tabu_search (permutation-based using swap neighbors)
 - simulated_annealing
 - GA skeleton (selection + crossover helpers)
Each function returns:
    solution, cost, history
for history we're gonna send the List to the front in order to visualize the process 
"""

import random
import math
from typing import List, Tuple
import numpy as np

def tour_distance(tour: List[int], dist_mat: List[List[float]]) -> float:
    """Compute total round-trip distance for a permutation (tour)."""
    d = 0.0
    for i in range(len(tour)-1):
        d += dist_mat[tour[i]][tour[i+1]]
    d += dist_mat[tour[-1]][tour[0]]
    return d


"""
this helper is responsible of generating neighbors for tabu search, it takes a list of integer as an argument(the initial solution )
and return a list of lists of integers(which are the possible neighbor solutions) 

"""
def generate_swap_neighbors(solution: List[int]) -> List[List[int]]:
    """All pairwise swap neighbors (i<j)."""
    neighbors = []
    n = len(solution)
    for i in range(n):
        for j in range(i+1, n):
            nb = solution.copy()
            nb[i], nb[j] = nb[j], nb[i]
            neighbors.append(nb)
    return neighbors

def tabu_search(dist_mat, n_iterations=500, tabu_size=50):
    """Tabu search for TSP. Returns best solution, best distance, history."""
    n = len(dist_mat)
    # initial random solution
    current = list(range(n))
    random.shuffle(current)
    best = current.copy()
    best_cost = tour_distance(best, dist_mat)

    from collections import deque
    tabu = deque(maxlen=tabu_size)

    history = []
    for it in range(n_iterations):
        neighbors = generate_swap_neighbors(current)

        # filter taboo (we store permutations in tabu)
        feasible = [v for v in neighbors if v not in tabu] # returns false if the solution does exist in the deque not to cross it again
        if not feasible:
            break

        # choose best neighbor (greedy)
        costs = [tour_distance(v, dist_mat) for v in feasible]
        idx = int(np.argmin(costs))
        current = feasible[idx]
        current_cost = costs[idx]

        # log step for visualization
        history.append({
            "iter": it,
            "current_solution": current.copy(),
            "current_cost": current_cost,
            "best_solution": best.copy(),
            "best_cost": best_cost
        })

        tabu.append(current.copy())

        if current_cost < best_cost:
            best = current.copy()
            best_cost = current_cost

    return best, best_cost, history

def simulated_annealing(dist_mat, n_iterations=1000, init_temp=1000.0, cooling_rate=0.995):
    """Simple SA for TSP using swap neighbor proposal."""
    n = len(dist_mat)
    current = list(range(n))
    random.shuffle(current)
    current_cost = tour_distance(current, dist_mat)
    best = current.copy()
    best_cost = current_cost

    history = []
    T = init_temp
    for it in range(n_iterations):
        # propose a swap neighbor
        i, j = random.sample(range(n), 2)
        new = current.copy()
        new[i], new[j] = new[j], new[i]
        new_cost = tour_distance(new, dist_mat)

        delta = new_cost - current_cost
        accept = False
        if delta < 0 or random.random() < math.exp(-delta / max(T, 1e-9)):
            accept = True

        if accept:
            current = new
            current_cost = new_cost

        if current_cost < best_cost:
            best = current.copy()
            best_cost = current_cost

        history.append({
            "iter": it,
            "candidate_solution": current.copy(),
            "candidate_cost": current_cost,
            "best_solution": best.copy(),
            "best_cost": best_cost,
            "temperature": T
        })

        T *= cooling_rate

    return best, best_cost, history

# GA skeleton (detailed implementation left for next steps)
def ga_tsp(dist_mat, population_size=50, generations=200, selection="roulette", crossover="pmx", mutation_rate=0.05):
    """
    Minimal GA for permutations. This is a skeleton to be extended.
    Returns best, cost, history (basic).
    """
    # Create initial population: random permutations
    n = len(dist_mat)
    pop = [random.sample(range(n), n) for _ in range(population_size)]

    def fitness(sol):
        return 1.0 / (tour_distance(sol, dist_mat) + 1e-9)

    history = []
    for gen in range(generations):
        # compute fitnesses
        fits = [fitness(s) for s in pop]
        # selection (roulette or rank)
        if selection == "roulette":
            # roulette selection to build mating pool
            total = sum(fits)
            probs = [f/total for f in fits]
            m_pool = [pop[roulette_choice(probs)] for _ in range(population_size)]
        elif selection == "rank":
            # rank selection: higher rank -> higher prob
            ranked = sorted(pop, key=lambda s: tour_distance(s, dist_mat))
            ranks = list(range(1, population_size+1))
            tot = sum(ranks)
            probs = [r/tot for r in ranks[::-1]]  # best has highest prob
            m_pool = [ranked[roulette_choice(probs)] for _ in range(population_size)]
        else:
            m_pool = pop.copy()

        # crossover: simple PMX (two-point) or OX
        children = []
        for i in range(0, population_size, 2):
            parent1 = m_pool[i]
            parent2 = m_pool[(i+1) % population_size]
            if crossover == "pmx":
                c1, c2 = pmx(parent1, parent2)
            elif crossover == "ox":
                c1, c2 = order_crossover(parent1, parent2)
            else:
                c1, c2 = parent1.copy(), parent2.copy()
            children.extend([c1, c2])

        # mutation: swap mutation
        for c in children:
            if random.random() < mutation_rate:
                i, j = random.sample(range(n), 2)
                c[i], c[j] = c[j], c[i]

        pop = children

        # track best
        best = min(pop, key=lambda s: tour_distance(s, dist_mat))
        best_cost = tour_distance(best, dist_mat)
        history.append({"gen": gen, "best_solution": best.copy(), "best_cost": best_cost})

    # final best
    best = min(pop, key=lambda s: tour_distance(s, dist_mat))
    best_cost = tour_distance(best, dist_mat)
    return best, best_cost, history

# Helpers for GA
def roulette_choice(probs):
    r = random.random()
    cum = 0.0
    for i, p in enumerate(probs):
        cum += p
        if r <= cum:
            return i
    return len(probs) - 1

def pmx(p1, p2):
    """Partially Mapped Crossover (PMX) for permutations (two-point)."""
    n = len(p1)
    c1 = [-1]*n
    c2 = [-1]*n
    a, b = sorted(random.sample(range(n), 2))
    # copy slice
    c1[a:b+1] = p1[a:b+1]
    c2[a:b+1] = p2[a:b+1]

    def fill(child, parent, a, b):
        for i in range(n):
            if child[i] == -1:
                val = parent[i]
                while val in child[a:b+1]:
                    # find mapping
                    idx = parent.index(val)
                    val = parent[idx]
                child[i] = val
        return child

    c1 = fill(c1, p2, a, b)
    c2 = fill(c2, p1, a, b)
    return c1, c2

def order_crossover(p1, p2):
    """Order Crossover (OX) - choose slice from p1, fill remaining from p2 order."""
    n = len(p1)
    a, b = sorted(random.sample(range(n), 2))
    c1 = [-1]*n
    c1[a:b+1] = p1[a:b+1]
    fill_idx = (b+1) % n
    p2_idx = (b+1) % n
    while -1 in c1:
        if p2[p2_idx] not in c1:
            c1[fill_idx] = p2[p2_idx]
            fill_idx = (fill_idx + 1) % n
        p2_idx = (p2_idx + 1) % n

    # symmetric for c2
    c2 = [-1]*n
    c2[a:b+1] = p2[a:b+1]
    fill_idx = (b+1) % n
    p1_idx = (b+1) % n
    while -1 in c2:
        if p1[p1_idx] not in c2:
            c2[fill_idx] = p1[p1_idx]
            fill_idx = (fill_idx + 1) % n
        p1_idx = (p1_idx + 1) % n
    return c1, c2
