// components/CreateEventModal.tsx
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useCreateEvent } from "../../hooks/useCommunities";
import Loader from "./Loader";


type Props = {
  isOpen: boolean;
  onClose: () => void;
  communityId: string;
  onCreateEvent: () => void;
};

type Frequency = 'once' | 'daily' | 'weekly' | 'monthly';

const CreateEventModal = ({ isOpen, onClose, communityId }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("once");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { mutate: createEvent, isPending } = useCreateEvent();

  const resetFields = () => {
    setTitle("");
    setDescription("");
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
    setFrequency("once");
    setErrors({});
  };

  useEffect(() => {
    if (!isOpen) resetFields();
  }, [isOpen]);

  const parseDateTime = (date: string, time: string) => {
    const combined = new Date(`${date}T${time}`);
    return isNaN(combined.getTime()) ? null : combined;
  };

  const validateDates = () => {
    const newErrors: { [key: string]: string } = {};
    const now = new Date();

    const start = parseDateTime(startDate, startTime);
    const end = parseDateTime(endDate, endTime);

    if (!start || !end) {
      if (!startDate || !startTime) newErrors.start = "Start date and time are required.";
      if (!endDate || !endTime) newErrors.end = "End date and time are required.";
    } else {
      if (start < now) newErrors.start = "Start time must be in the future.";
      if (end < now) newErrors.end = "End time must be in the future.";
      if (end <= start) newErrors.end = "End time must be after start time.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    if (!title.trim()) {
      setErrors({ title: "Title is required." });
      return;
    }

    if (!validateDates()) return;

    createEvent(
      {
        communityId,
        title: title.trim(),
        description: description.trim(),
        startDate: `${startDate}T${startTime}`,
        endDate: `${endDate}T${endTime}`,
        frequency
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err: unknown) => {
          console.error("Failed to create event:", err);
        },
      }
    );
  };

  const isDisabled =
    !title || !startDate || !startTime || !endDate || !endTime || Object.keys(errors).length > 0;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-xl bg-zinc-900 text-white shadow-xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-700">
                  <Dialog.Title className="text-lg font-semibold">Create Event</Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-lg font-semibold hover:opacity-70 transition"
                  >
                    ✕
                  </button>
                </div>

                {/* Form */}
                <div className="p-6 space-y-4">
                  <div>
                    <label className="text-sm">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-zinc-800 text-white rounded-md outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="text-sm">Description</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-zinc-800 text-white rounded-md outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm">Start Date</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-zinc-800 text-white rounded-md outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm">Start Time</label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-zinc-800 text-white rounded-md outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                      />
                    </div>
                  </div>
                  {errors.start && <p className="text-red-500 text-sm">{errors.start}</p>}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm">End Date</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-zinc-800 text-white rounded-md outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm">End Time</label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-zinc-800 text-white rounded-md outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                      />
                    </div>
                   
                  </div>
                  {errors.end && <p className="text-red-500 text-sm">{errors.end}</p>}
                  
                  <div className="w-full">
                    <label className="text-sm mb-1 block">Frequency</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value as typeof frequency)}
                      className="w-full px-3 py-2 bg-zinc-800 text-white rounded-xl outline-none border border-zinc-700 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-colors"
                    >
                      <option value="once">Once</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>


                  <button
                    onClick={handleCreate}
                    disabled={isDisabled || isPending}
                    className={`w-full py-2 mt-4 rounded-md font-medium ${
                      isDisabled || isPending
                        ? "bg-zinc-700 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 transition"
                    }`}
                  >
                    {isPending ? <Loader /> : "Create Event"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateEventModal;
