from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from datetime import datetime

app = FastAPI()

# Allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ya tumhare frontend ka URL
    allow_methods=["*"],
    allow_headers=["*"]
)

phenotype_map = {
    "CYP2C19": {"*1/*1": "NM","*1/*2": "IM","*2/*2": "PM","*1/*17": "RM","*17/*17": "URM"},
    "CYP2D6": {"*1/*1": "NM","*1/*4": "IM","*4/*4": "PM","*1/*2xN": "URM"}
}

risk_map = {
    "CLOPIDOGREL": {"CYP2C19": {"NM": ("Safe","low"),"IM": ("Adjust Dosage","moderate"),"PM": ("Ineffective","high"),"RM": ("Safe","low"),"URM": ("Safe","low")}},
    "CODEINE": {"CYP2D6": {"NM": ("Safe","low"),"IM": ("Adjust Dosage","moderate"),"PM": ("Ineffective","high"),"URM": ("Toxic","critical")}},
    "WARFARIN": {"CYP2C19": {"NM": ("Safe","low"),"IM": ("Adjust Dosage","moderate"),"PM": ("Toxic","high")}}
}

def evaluate_risk(patient_id, drug, gene, diplotype):
    phenotype = phenotype_map.get(gene, {}).get(diplotype, "Unknown")
    risk_info = risk_map.get(drug, {}).get(gene, {}).get(phenotype, ("Unknown", "none"))
    risk_label, severity = risk_info

    return {
        "patient_id": patient_id,
        "drug": drug,
        "risk_label": risk_label,
        "severity": severity,
        "phenotype": phenotype,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/evaluate")
async def evaluate(data: dict):
    patient_id = data.get("patient_id")
    drug = data.get("drug")
    gene = data.get("gene")
    diplotype = data.get("diplotype")

    result = evaluate_risk(patient_id, drug, gene, diplotype)
    return JSONResponse(content=result)