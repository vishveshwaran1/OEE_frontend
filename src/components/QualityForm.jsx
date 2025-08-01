import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const QualityForm = () => {
  const [formData, setFormData] = useState({
    date: '',
    shift: '',
    rejections: [{ partNumber: '', count: '', reason: '' }],
    stopTimes: [{ duration: '', reason: '' }]
  });
  
  const [correctionForm, setCorrectionForm] = useState({
    problem: '',
    date: '',
    correctiveAction: ''
  });

  const [planForm, setPlanForm] = useState({
    partNumber: '',
    plan: '',
    date: '',
    shift: ''
  });

  // Existing data arrays
  const rejectionReasons = [
    'Forming crack', 'Forming offset', 'Deep Monogram', 'Dent',
    'Double monogram', 'Double Profile(sizing)', 'ID bend', 'Line mark',
    'Material Peel Off', 'Monogram Offset', 'Notching Crack',
    'Notching Offset', 'Ovality', 'Profile Off Set', 'Trimming Double Stroke',
    'Trimming End Cut', 'Trimming Profile Damage', 'Improper Notching',
    'Trimming Tight', 'Others'
  ];

  const stopTimeReasons = [
    'Line Scheduled Cleaning', 'Line Scheduled Prv. Maintenance',
    'Line Scheduled Meeting', 'Line Planed Brake', 'Awaiting instruction loss',
    'Awaiting Material loss', 'Want of men', 'Want of spares / hand tools',
    'Air Pressure Down', 'Power Failure', 'Tool Break doon',
    'Line Equipment Failurek', 'Line Setup & Adjustment Loss',
    'Line Cutting Tool Change Loss', 'Line Startup Loss',
    'Measurement & Adjustment Loss', 'Others'
  ];

  const parts = [
    { number: '9253020232', name: 'BIG CYLINDER' },
    { number: '9253010242', name: 'SMALL CYLINDER' }
  ];

  // Existing handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://oee-backend-1.onrender.com/api/quality-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        alert('Data submitted successfully');
        setFormData({
          date: '',
          shift: '',
          rejections: [{ partNumber: '', count: '', reason: '' }],
          stopTimes: [{ duration: '', reason: '' }]
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    }
  };

  // Handler for correction form submission
  const handleCorrectionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://oee-backend-1.onrender.com/api/correction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...correctionForm,
          date: correctionForm.date // Already in yyyy-mm-dd format from input
        }),
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Correction data saved successfully');
        // Reset form
        setCorrectionForm({
          problem: '',
          date: '',
          correctiveAction: ''
        });
      } else {
        toast.error(data.message || 'Error saving correction data');
      }
    } catch (error) {
      toast.error('Error submitting correction data');
      console.error('Error:', error);
    }
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://oee-backend-1.onrender.com/api/set-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planForm),
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Plan data saved successfully');
        setPlanForm({
          partNumber: '',
          plan: '',
          date: '',
          shift: ''
        });
      } else {
        toast.error(data.message || 'Error saving plan data');
      }
    } catch (error) {
      toast.error('Error submitting plan data');
      console.error('Error:', error);
    }
  };


  const addRejection = () => {
    setFormData({
      ...formData,
      rejections: [...formData.rejections, { partNumber: '', count: '', reason: '' }]
    });
  };

  const addStopTime = () => {
    setFormData({
      ...formData,
      stopTimes: [...formData.stopTimes, { duration: '', reason: '' }]
    });
  };

  const removeRejection = (index) => {
    const newRejections = formData.rejections.filter((_, i) => i !== index);
    setFormData({ ...formData, rejections: newRejections });
  };

  const removeStopTime = (index) => {
    const newStopTimes = formData.stopTimes.filter((_, i) => i !== index);
    setFormData({ ...formData, stopTimes: newStopTimes });
  };

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-2 py-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Column: Data Entry Form */}
          <div className="w-full lg:w-1/2">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-bold text-[#143D60] mb-4">Data Entry Form</h2>
              
              {/* Date and Shift Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Select Shift</option>
                    <option value="shift-1">Shift 1</option>
                    <option value="shift-2">Shift 2</option>
                  </select>
                </div>
              </div>

              {/* Rejections Section */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-[#5506D6] mb-2">Rejected Parts Details</h3>
                <div className="space-y-2">
                  {formData.rejections.map((rejection, index) => (
                    <div key={index} className="bg-cyan-50 p-3 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Part</label>
                          <select
                            value={rejection.partNumber}
                            onChange={(e) => {
                              const newRejections = [...formData.rejections];
                              newRejections[index].partNumber = e.target.value;
                              setFormData({ ...formData, rejections: newRejections });
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md"
                           
                          >
                            <option value="">Select Part</option>
                            {parts.map(part => (
                              <option key={part.number} value={part.number}>
                                {part.name} ({part.number})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Count</label>
                          <input
                            type="number"
                            min="0"
                            value={rejection.count}
                            onChange={(e) => {
                              const newRejections = [...formData.rejections];
                              newRejections[index].count = e.target.value;
                              setFormData({ ...formData, rejections: newRejections });
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                          <select
                            value={rejection.reason}
                            onChange={(e) => {
                              const newRejections = [...formData.rejections];
                              newRejections[index].reason = e.target.value;
                              setFormData({ ...formData, rejections: newRejections });
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md"
                           
                          >
                            <option value="">Select Reason</option>
                            {rejectionReasons.map(reason => (
                              <option key={reason} value={reason}>{reason}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {formData.rejections.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRejection(index)}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addRejection}
                  className="text-[#143D60] border border-[#143D60] px-3 py-1 rounded-md hover:bg-cyan-50 text-sm mt-4"
                >
                  Add More Rejections
                </button>
              </div>

              {/* Stop Times Section */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-[#5506D6] mb-2">Stop Times</h3>
                <div className="space-y-2">
                  {formData.stopTimes.map((stopTime, index) => (
                    <div key={index} className="bg-cyan-50 p-3 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                          <input
                            type="number"
                            min="0"
                            value={stopTime.duration}
                            onChange={(e) => {
                              const newStopTimes = [...formData.stopTimes];
                              newStopTimes[index].duration = e.target.value;
                              setFormData({ ...formData, stopTimes: newStopTimes });
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                          <select
                            value={stopTime.reason}
                            onChange={(e) => {
                              const newStopTimes = [...formData.stopTimes];
                              newStopTimes[index].reason = e.target.value;
                              setFormData({ ...formData, stopTimes: newStopTimes });
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                          >
                            <option value="">Select Reason</option>
                            {stopTimeReasons.map(reason => (
                              <option key={reason} value={reason}>{reason}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {formData.stopTimes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStopTime(index)}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addStopTime}
                  className="text-[#143D60] border border-[#143D60] px-3 py-1 rounded-md hover:bg-orange-50 text-sm mt-4"
                >
                  Add More Stop Times
                </button>
              </div>

              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-[#143D60] text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors text-sm"
                >
                  Submit
                </button>
              </div>
            </div>
            </form>
          </div>

          {/* Right Column: Plan Form and Corrective Action Form */}
          <div className="w-full flex flex-col gap-4 mt-0 lg:mt-0 lg:flex-col lg:w-1/2">

            {/*  Corrective Action Form */}
            <div className="w-full">
              <form onSubmit={handleCorrectionSubmit} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4 lg:mb-0">
                <h2 className="text-lg font-bold text-[#143D60] mb-4">Corrective Action Form</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={correctionForm.date}
                      onChange={(e) => setCorrectionForm({ ...correctionForm, date: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Problem</label>
                    <textarea
                      value={correctionForm.problem}
                      onChange={(e) => setCorrectionForm({ ...correctionForm, problem: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md h-24 resize-none"
                      placeholder="Describe the problem..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Corrective Action</label>
                    <textarea
                      value={correctionForm.correctiveAction}
                      onChange={(e) => setCorrectionForm({ ...correctionForm, correctiveAction: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md h-24 resize-none"
                      placeholder="Describe the solution..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#143D60] text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors text-sm"
                  >
                    Submit Correction
                  </button>
                </div>
              </form>
            </div>

            {/* Plan Form */}
            <div className="w-full">
              <form onSubmit={handlePlanSubmit} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4 lg:mb-0">
                <h2 className="text-lg font-bold text-[#143D60] mb-4">Set Production Plan</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Part Number</label>
                    <select
                      value={planForm.partNumber}
                      onChange={(e) => setPlanForm({ ...planForm, partNumber: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Part</option>
                      {parts.map(part => (
                        <option key={part.number} value={part.number}>
                          {part.name} ({part.number})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan Count</label>
                    <input
                      type="number"
                      min="0"
                      value={planForm.plan}
                      onChange={(e) => setPlanForm({ ...planForm, plan: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={planForm.date}
                      onChange={(e) => setPlanForm({ ...planForm, date: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                    <select
                      value={planForm.shift}
                      onChange={(e) => setPlanForm({ ...planForm, shift: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="">Select Shift</option>
                      <option value="shift-1">Shift 1</option>
                      <option value="shift-2">Shift 2</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#143D60] text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors text-sm"
                  >
                    Set Plan
                  </button>
                </div>
              </form>
            </div>
          </div>  
        </div>
      </div>
    </div>
  );
};

export default QualityForm;
