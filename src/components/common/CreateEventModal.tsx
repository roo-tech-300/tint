import { useState, useEffect, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  onEventCreated?: (newEvent: any) => void;
};

const frequencies = ['One-time', 'Daily', 'Weekly', 'Monthly'];

const CreateEventModal = ({ isOpen, onClose, isAdmin, onEventCreated }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [frequency, setFrequency] = useState('One-time');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const modalRef = useRef<HTMLDivElement>(null);
  const now = new Date();

  const parseDateTime = (date: string, time: string) => {
    try {
      return new Date(`${date}T${time}`);
    } catch {
      return null;
    }
  };

  const validateDates = () => {
    const newErrors: { [key: string]: string } = {};

    const start = parseDateTime(startDate, startTime);
    const end = parseDateTime(endDate, endTime);

    if (!startDate) newErrors.startDate = 'Start date is required';
    if (!startTime) newErrors.startTime = 'Start time is required';
    if (!endDate) newErrors.endDate = 'End date is required';
    if (!endTime) newErrors.endTime = 'End time is required';

    if (start && start < now) newErrors.startDate = 'Start time must be in the future';
    if (end && end < now) newErrors.endDate = 'End time must be in the future';

    if (start && end && end <= start) {
      newErrors.endDate = 'End must be after start';
      newErrors.endTime = 'End must be after start';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🧠 Validate whenever dates/times change
  useEffect(() => {
    if (startDate || startTime || endDate || endTime) {
      validateDates();
    }
  }, [startDate, startTime, endDate, endTime]);

  const isFormReady =
    title.trim() &&
    description.trim() &&
    startDate &&
    startTime &&
    endDate &&
    endTime &&
    Object.keys(errors).length === 0;

  const handleSubmit = () => {
    if (!validateDates()) return;

    const newEvent = {
      title,
      description,
      start: `${startDate}T${startTime}`,
      end: `${endDate}T${endTime}`,
      frequency,
    };

    onEventCreated?.(newEvent);
    onClose();
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <Dialog.Panel
              ref={modalRef}
              className="w-full max-w-lg p-6 bg-[#111] rounded-2xl shadow-lg"
            >
              <h2 className="text-xl font-semibold text-purple-600 mb-4">Create Event</h2>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Event Title"
                  className="w-full p-2 rounded-md bg-gray-900 text-white focus:outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  placeholder="Description"
                  className="w-full p-2 rounded-md bg-gray-900 text-white focus:outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="date"
                      className="w-full p-2 rounded-md bg-gray-900 text-white appearance-none"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-red-400">{errors.startDate}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="time"
                      className="w-full p-2 rounded-md bg-gray-900 text-white appearance-none"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                    {errors.startTime && (
                      <p className="text-sm text-red-400">{errors.startTime}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="date"
                      className="w-full p-2 rounded-md bg-gray-900 text-white appearance-none"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    {errors.endDate && (
                      <p className="text-sm text-red-400">{errors.endDate}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="time"
                      className="w-full p-2 rounded-md bg-gray-900 text-white appearance-none"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                    {errors.endTime && (
                      <p className="text-sm text-red-400">{errors.endTime}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400">Frequency</label>
                  <select
                    className="w-full p-2 rounded-md bg-gray-900 text-white focus:outline-none"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                  >
                    {frequencies.map((freq) => (
                      <option key={freq} value={freq}>
                        {freq}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6 gap-3">
                <button
                  onClick={onClose}
                  className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!isFormReady}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    isFormReady
                      ? 'bg-purple-600 hover:bg-purple-500 text-white'
                      : 'bg-gray-600 text-white opacity-50 cursor-not-allowed'
                  }`}
                >
                  Create Event
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default CreateEventModal;
