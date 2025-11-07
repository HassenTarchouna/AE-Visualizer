from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api_models import RunRequest, RunResponse
from app.algorithms import tsp, scheduler
import importlib, inspect, pathlib

app = FastAPI(title="TSP & Scheduler Algorithms API")

# Allow local dev + frontends to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000", 
        "https://ae-visualizer-git-master-hassentarchounas-projects.vercel.app",
        "https://ae-visualizer.vercel.app",  # Your main domain
        "https://*.vercel.app",  # Allow all Vercel subdomains
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/tsp/run", response_model=RunResponse)
async def run_tsp(req: RunRequest):
    """
    Run a TSP algorithm.
    req.data should be a distance matrix (list of lists)
    """
    if req.problem != "tsp":
        raise HTTPException(status_code=400, detail="Use /sched/run for scheduler problem")

    dist_mat = req.data
    algo = req.algorithm.lower()

    try:
        if algo == "tabu":
            iters = int(req.params.get("iterations", 500))
            tabu_size = int(req.params.get("tabu_size", 50))
            best, cost, history = tsp.tabu_search(dist_mat, n_iterations=iters, tabu_size=tabu_size)
        elif algo == "sa":
            iters = int(req.params.get("iterations", 1000))
            temp = float(req.params.get("init_temp", 1000.0))
            rate = float(req.params.get("cooling_rate", 0.995))
            best, cost, history = tsp.simulated_annealing(dist_mat, n_iterations=iters, init_temp=temp, cooling_rate=rate)
        elif algo == "ga":
            pop = int(req.params.get("pop", 50))
            gens = int(req.params.get("generations", 200))
            sel = req.params.get("selection", "roulette")
            cx = req.params.get("crossover", "pmx")
            best, cost, history = tsp.ga_tsp(dist_mat, population_size=pop, generations=gens, selection=sel, crossover=cx)
        else:
            raise HTTPException(status_code=400, detail="Unknown algorithm")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Algorithm error: {str(e)}")

    return RunResponse(
        best_solution=best,
        best_cost=cost,
        history=history,
        metadata={"algorithm": algo}
    )

@app.post("/sched/run", response_model=RunResponse)
async def run_scheduler(req: RunRequest):
    """
    Run scheduler algorithms.
    req.data should be a dict with 'durations' key or direct durations list
    """
    if req.problem != "scheduler":
        raise HTTPException(status_code=400, detail="Use /tsp/run for TSP problem")

    # FIX: Handle both direct durations array and object with durations key
    if isinstance(req.data, dict) and 'durations' in req.data:
        durations = req.data['durations']
    else:
        durations = req.data

    algo = req.algorithm.lower()

    try:
        if algo == "tabu":
            iters = int(req.params.get("iterations", 500))
            tabu_size = int(req.params.get("tabu_size", 50))
            best, cost, history = scheduler.tabu_search(durations, n_iterations=iters, tabu_size=tabu_size)
        elif algo == "sa":
            iters = int(req.params.get("iterations", 1000))
            temp = float(req.params.get("init_temp", 1000.0))
            rate = float(req.params.get("cooling_rate", 0.995))
            best, cost, history = scheduler.simulated_annealing(durations, n_iterations=iters, init_temp=temp, cooling_rate=rate)
        elif algo == "ga":
            # NEW: GA support for scheduler
            pop = int(req.params.get("pop", 50))
            gens = int(req.params.get("generations", 200))
            sel = req.params.get("selection", "roulette")
            cx = req.params.get("crossover", "one-point")
            mut = float(req.params.get("mutation_rate", 0.05))
            best, cost, history = scheduler.ga_scheduler(durations, population_size=pop, generations=gens, selection=sel, crossover=cx, mutation_rate=mut)
        else:
            raise HTTPException(status_code=400, detail="Unknown algorithm")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Algorithm error: {str(e)}")

    return RunResponse(
        best_solution=best,
        best_cost=cost,
        history=history,
        metadata={"algorithm": algo}
    )

# Endpoint to return the source code of algorithms
@app.get("/source/{module_name}")
async def get_source(module_name: str):
    """
    Example: GET /source/tsp will return the text content of app/algorithms/tsp.py
    """
    base = pathlib.Path(__file__).parent
    modpath = base / "algorithms" / f"{module_name}.py"
    if not modpath.exists():
        raise HTTPException(status_code=404, detail="Module not found")
    return {"module": module_name, "source": modpath.read_text()}

# health
@app.get("/health")
async def health():
    return {"status": "ok"}