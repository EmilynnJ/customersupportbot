import { useState } from 'react';

const emptyForm = {
  id: null,
  question: '',
  answer: ''
};

const FaqEditor = ({ faqs, onSave, onDelete, saving }) => {
  const [form, setForm] = useState(emptyForm);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.question.trim() || !form.answer.trim()) return;
    onSave(form);
    setForm(emptyForm);
  };

  const handleEdit = (faq) => {
    setForm(faq);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">FAQ Manager</h3>
          <p className="text-sm text-gray-600 mt-1">Update answers customers receive instantly.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Question</label>
          <input
            type="text"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="How do I track my order?"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Answer</label>
          <textarea
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            rows={4}
            placeholder="Customers can track their order by..."
            required
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-primary text-white rounded-2xl font-semibold hover:bg-blue-600 transition disabled:opacity-60"
          >
            {form.id ? 'Update FAQ' : 'Add FAQ'}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={() => setForm(emptyForm)}
              className="px-4 py-2 border border-gray-200 rounded-2xl font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-4">
        {faqs.length === 0 && (
          <p className="text-sm text-gray-500">No FAQs yet. Add your first entry above.</p>
        )}
        {faqs.map((faq) => (
          <div key={faq.id} className="border border-gray-200 rounded-2xl p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-base font-semibold text-gray-900">{faq.question}</h4>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(faq)}
                    className="text-sm text-primary font-semibold hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(faq.id)}
                    className="text-sm text-red-500 font-semibold hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-line">{faq.answer}</p>
              <p className="text-xs text-gray-400">Last updated {new Date(faq.updated_at).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqEditor;

