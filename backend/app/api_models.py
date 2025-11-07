from pydantic import BaseModel
from typing import List, Optional, Any, Union

# Generic request to run an algorithm
class RunRequest(BaseModel):
    algorithm: str                   # "tabu", "sa", "ga"
    problem: str                     # "tsp" or "scheduler"
    params: Optional[dict] = {}      # algorithm-specific params
    data: Any                        # distance matrix for TSP or task data for scheduler

# Response including history to visualize steps
class RunResponse(BaseModel):
    best_solution: List[int]
    best_cost: float
    history: List[dict]              # list of steps to animate
    metadata: Optional[dict] = {}

# for better frontend compatibility
class FrontendResponse(BaseModel):
    best_solution: List[int]
    best_cost: float
    history: List[dict]
    metadata: Optional[dict] = {}