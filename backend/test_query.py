from app.database import SessionLocal
from app.crud import process_copilot_query

db = SessionLocal()
try:
    res = process_copilot_query(db, "What is the status of our warehouses?")
    print("SUCCESS! Intent:", res.intent)
    print("Answer:\n", res.answer)
    print("Action cards:", len(res.action_cards))
finally:
    db.close()
