// components/EventModal.tsx
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { Models } from "appwrite";

type Event = Models.Document;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
};

const EventModal = ({ isOpen, onClose, events }: Props) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
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

        {/* Modal content */}
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-zinc-900 text-white shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between px-2 py-4 border-b border-zinc-700">
                  <Dialog.Title className="text-lg font-semibold">
                    Upcoming Events
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-lg font-semibold px-4 py-2 hover:opacity-70 transition"
                  >
                    ✕
                  </button>
                </div>

                {/* Events List */}
                <div className="max-h-[400px] overflow-y-auto px-6 py-4 space-y-4">
                  {events.length > 0 ? (
                    events.map((event) => (
                      <div
                        key={event.$id}
                        className="bg-zinc-800 p-4 rounded-lg flex flex-col space-y-1"
                      >
                        <span className="text-base font-medium">
                          {event.title}
                        </span>
                        <span className="text-sm text-zinc-400">
                          {event.date}
                        </span>
                        {event.description && (
                          <span className="text-sm text-zinc-300">
                            {event.description}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-400">
                      No upcoming events yet.
                    </p>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EventModal;
