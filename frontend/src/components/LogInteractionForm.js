// frontend/src/components/LogInteractionForm.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createInteraction } from '../features/interactions/interactionsSlice';

export default function LogInteractionForm() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.interactions);

  const [form, setForm] = useState({
    hcp_name: '',
    specialty: '',
    channel: '',
    notes: '',
    follow_up_required: false,
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.hcp_name.trim()) {
      alert("HCP Name is required");
      return;
    }

    const result = await dispatch(createInteraction(form));

    if (createInteraction.fulfilled.match(result)) {
      alert("Saved successfully!");
      setForm({ hcp_name: '', specialty: '', channel: '', notes: '', follow_up_required: false });
    } else {
      alert("Error: " + (result.payload || "Unknown error"));
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 500, margin: '20px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Log Interaction</h2>

      <label>HCP Name *</label>
      <input name="hcp_name" value={form.hcp_name} onChange={onChange} style={{ width: '100%', padding: 8, marginBottom: 10 }} />

      <label>Specialty</label>
      <input name="specialty" value={form.specialty} onChange={onChange} style={{ width: '100%', padding: 8, marginBottom: 10 }} />

      <label>Channel</label>
      <input name="channel" value={form.channel} onChange={onChange} style={{ width: '100%', padding: 8, marginBottom: 10 }} />

      <label>Notes</label>
      <textarea name="notes" value={form.notes} onChange={onChange} style={{ width: '100%', padding: 8, marginBottom: 10 }} />

      <label>
        <input type="checkbox" name="follow_up_required" checked={form.follow_up_required} onChange={onChange} />
        Follow-up required
      </label>

      <button type="submit" disabled={loading} style={{ display: 'block', marginTop: 20 }}>
        {loading ? "Saving..." : "Save Interaction"}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
