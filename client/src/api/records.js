const createPayout = (recordId) => {
  return fetch(`http://localhost:5050/record/${recordId}/payout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const edit = (recordId, body) => {
  return fetch(`http://localhost:5050/record/${recordId}`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const getById = (recordId) => {
  return fetch(`http://localhost:5050/record/${recordId}`);
};

const create = (body) => {
  return fetch("http://localhost:5050/record", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

const getAll = () => {
  return fetch(`http://localhost:5050/record/`);
};

export const recordsApi = { createPayout, edit, getById, create, getAll };
