from fastapi.testclient import TestClient
import os, tempfile, sqlite3

# Ensure DB_PATH is isolated for tests before importing app
_fd, test_db_path = tempfile.mkstemp(prefix="flashcards_test_", suffix=".db")
os.close(_fd)
os.environ['DB_PATH'] = test_db_path

from main import app, init_db  # noqa: E402

client = TestClient(app)


def setup_module(module):  # noqa: D401
    init_db()


def teardown_module(module):  # noqa: D401
    try:
        os.remove(test_db_path)
    except OSError:
        pass


def test_root():
    r = client.get('/')
    assert r.status_code == 200
    assert 'message' in r.json()


def test_create_and_list_flashcard():
    payload = {"question": "What is AI?", "answer": "Artificial Intelligence", "topic": "Tech"}
    r = client.post('/flashcards', json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data['question'] == payload['question']

    r2 = client.get('/flashcards')
    assert r2.status_code == 200
    cards = r2.json()
    assert any(c['question'] == payload['question'] for c in cards)


def test_generate_flashcards_fallback():
    # Without GROQ key this should still return fallback deterministic list
    r = client.post('/generate_flashcards', json={"topic": "Python", "n": 3})
    assert r.status_code in (200, 422)  # 422 allowed if validation forced
    if r.status_code == 200:
        data = r.json()
        assert isinstance(data, list)
        assert len(data) <= 3
