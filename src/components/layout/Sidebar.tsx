import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const savedResults = useSelector((state: RootState) => state.results.savedResults);
  const scenarios = useSelector((state: RootState) => state.scenarios.scenarios);
  
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-800 bg-opacity-75 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-auto md:bg-transparent md:shadow-none md:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden"
            >
              <span className="sr-only">Close menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 px-4 py-6 overflow-y-auto">
            <nav className="space-y-8">
              {/* Scenarios */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Scenarios
                </h3>
                <ul className="mt-3 space-y-2">
                  {scenarios.map((scenario) => (
                    <li key={scenario.id}>
                      <a
                        href="#"
                        className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
                      >
                        <svg
                          className="mr-3 h-5 w-5 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        {scenario.name}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-blue-600 hover:bg-blue-50"
                    >
                      <svg
                        className="mr-3 h-5 w-5 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Create New Scenario
                    </a>
                  </li>
                </ul>
              </div>
              
              {/* Saved Results */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Saved Results
                </h3>
                <ul className="mt-3 space-y-2">
                  {savedResults.length > 0 ? (
                    savedResults.map((result, index) => (
                      <li key={index}>
                        <a
                          href="#"
                          className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
                        >
                          <svg
                            className="mr-3 h-5 w-5 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                          </svg>
                          Simulation {index + 1} - {new Date(result.simulationDateTime).toLocaleDateString()}
                        </a>
                      </li>
                    ))
                  ) : (
                    <li className="px-2 py-2 text-sm text-gray-500">
                      No saved results yet
                    </li>
                  )}
                </ul>
              </div>
              
              {/* Documentation */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Documentation
                </h3>
                <ul className="mt-3 space-y-2">
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <svg
                        className="mr-3 h-5 w-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      How to Use
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
                    >
                      <svg
                        className="mr-3 h-5 w-5 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                        />
                      </svg>
                      Game Mechanics Explained
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <a
              href="https://github.com/dxaginfo/game-mechanics-simulator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              <svg
                className="mr-2 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              View Source Code
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;