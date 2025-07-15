// components/CommunityMembersModal.tsx
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { Models } from "appwrite";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  members: {
    user: Models.Document;
    isAdmin: boolean;
  }[];
  admins: string[];
  currentUserId: string;
  isCurrentUserAdmin: boolean;
  handleMakeAdmin: (userId: string) => Promise<void>;
};



const CommunityMembersModal = ({
  isOpen,
  onClose,
  members,
  currentUserId,
  handleMakeAdmin,
  isCurrentUserAdmin,
}: Props) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
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

        {/* Modal */}
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
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-700">
                  <Dialog.Title className="text-lg font-semibold">
                    Community Members
                  </Dialog.Title>
                  <button onClick={onClose} className="text-sm hover:opacity-70">
                    ✕
                  </button>
                </div>

                <div className="max-h-[400px] overflow-y-auto px-6 py-4 space-y-4">
                  {members.map(({ user, isAdmin }) => (
                    <div  
                      key={user.$id}
                      className="flex items-center justify-between bg-zinc-800 p-3 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 text-xs font-semibold">
                            {user.name?.[0]?.toUpperCase() || "?"}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span>{user.name}</span>
                          {isAdmin && (
                            <span className="text-xs text-purple-400">Admin</span>
                          )}
                        </div>
                      </div>

                      {/* Show "Make Admin" if current user is admin and target user is not */}
                      {isCurrentUserAdmin && !isAdmin && user.$id !== currentUserId && (
                        <button
                          onClick={() => handleMakeAdmin(user.$id)}
                          className="text-xs font-medium text-white border border-purple-400 bg-purple-400 px-3 py-1 rounded hover:bg-purple-500 hover:text-white transition"
                        >
                          Make Admin
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CommunityMembersModal;
