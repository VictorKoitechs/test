import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { recordsApi } from "../api/records";
import { ToastContainer, toast } from "react-toastify";

export default function Edit() {
  const params = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    level: "",
  });

  useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      const response = await recordsApi.getById(params.id);

      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const record = await response.json();

      if (!record) {
        window.alert(`Record with id ${id} not found`);
        navigate("/");
        return;
      }

      setRecord(record);
    }

    fetchData();

    return;
  }, [params.id, navigate]);

  useEffect(() => {
    if (record) {
      setForm({
        email: record.email,
        name: record.name,
        level: record.level,
      });
    }
  }, [record]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmitEditForm(e) {
    e.preventDefault();
    const editedPerson = {
      name: form.name,
      email: form.email,
      level: form.level,
    };

    await recordsApi.edit(params.id, editedPerson);
    navigate("/");
  }

  async function handleButtonPayoutSubmit() {
    const response = await recordsApi
      .createPayout(params.id)
      .then((res) => res.json());

    toast.success(`Payout was created with status: ${response.status}`);
  }

  return (
    <div>
      <h3>Update Record</h3>
      <form onSubmit={onSubmitEditForm}>
        <div className="form-group">
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={form.email}
            onChange={(e) => updateForm({ email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="positionOptions"
              id="positionIntern"
              value="Intern"
              checked={form.level === "Intern"}
              onChange={(e) => updateForm({ level: e.target.value })}
            />
            <label htmlFor="positionIntern" className="form-check-label">
              Intern
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="positionOptions"
              id="positionJunior"
              value="Junior"
              checked={form.level === "Junior"}
              onChange={(e) => updateForm({ level: e.target.value })}
            />
            <label htmlFor="positionJunior" className="form-check-label">
              Junior
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="positionOptions"
              id="positionSenior"
              value="Senior"
              checked={form.level === "Senior"}
              onChange={(e) => updateForm({ level: e.target.value })}
            />
            <label htmlFor="positionSenior" className="form-check-label">
              Senior
            </label>
          </div>
        </div>
        <br />

        <div className="form-group">
          <input
            type="submit"
            value="Update Record"
            className="btn btn-primary"
          />
        </div>
      </form>

      <button
        disabled={!record?.amount}
        className="btn btn-primary"
        onClick={handleButtonPayoutSubmit}
      >
        Payout {record?.amount && `${record?.amount}$`}
      </button>
    </div>
  );
}
