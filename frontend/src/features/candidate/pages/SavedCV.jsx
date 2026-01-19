import React from 'react';
import '../components/SavedCV.css';
/*demo Save sv code chưa chỉnh*/
const SavedCV = () => {
  const cvList = [
    {
      id: 1,
      title: "Software Engineer Resume",
      lastModified: "Oct 26, 2024",
      targetPosition: "Software Engineer",
      image: "https://via.placeholder.com/400x300?text=Software+Engineer",
    },
    {
      id: 2,
      title: "Digital Marketing Specialist CV",
      lastModified: "Oct 26, 2024",
      targetPosition: "Marketing Specialist",
      image: "https://via.placeholder.com/400x300?text=Digital+Marketing",
    },
    {
      id: 3,
      title: "Graphic Design Portfolio CV",
      lastModified: "Oct 26, 2024",
      targetPosition: "Graphic Designer",
      image: "https://via.placeholder.com/400x300?text=Graphic+Design",
    },
    {
      id: 4,
      title: "Data Analyst Resume",
      lastModified: "Oct 25, 2024",
      targetPosition: "Data Analyst",
      image: "https://via.placeholder.com/400x300?text=Data+Analyst",
    },
    {
      id: 5,
      title: "Entry-Level Nurse CV",
      lastModified: "Oct 20, 2024",
      targetPosition: "Nurse",
      image: "https://via.placeholder.com/400x300?text=Nurse",
    },
    {
      id: 6,
      title: "Project Manager Resume",
      lastModified: "Oct 18, 2024",
      targetPosition: "Project Manager",
      image: "https://via.placeholder.com/400x300?text=Project+Manager",
    }
  ];

  return (
    <div className="saved-cv-container text-slate-800">
      <aside className="w-64 bg-sidebar text-white flex flex-col h-full flex-shrink-0 transition-all duration-300">
        <div className="h-20 flex items-center px-6">
          <div className="flex items-center gap-3">
            <img
              alt="CareerForge Logo"
              className="w-[140px] logo-style"
              src="https://via.placeholder.com/140x40?text=CareerForge" // Thay bằng link logo thực tế
            />
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-2">
          <a href="#" className="flex items-center gap-3 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors group px-4">
            <svg className="w-6 h-6 group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors group px-4">
            <svg className="w-6 h-6 group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-medium">My Profile</span>
          </a>
          <a href="#" className="flex items-center gap-3 py-3 bg-sidebar-active text-white rounded-lg shadow-sm px-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-medium">Saved CVs</span>
          </a>
        </nav>
      </aside>
      <main className="flex-1 h-full overflow-y-auto scroll-smooth bg-[#f1f5f9]">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">My CVs</h1>
            <button className="create-btn shadow-md transition-colors flex items-center gap-2 font-medium">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Create New CV
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            
            {cvList.map((cv) => (
              <article key={cv.id} className="bg-white rounded-xl card-shadow overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow border border-slate-200">

                <div className="h-48 w-full bg-slate-100 relative group overflow-hidden border-b border-slate-100">
                  <img
                    alt={`${cv.title} Preview`}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    src={cv.image}
                  />
                </div>

                <div className="p-5 flex-1">
                  <h2 className="card-title mb-2 truncate">{cv.title}</h2>
                  <div className="space-y-1">
                    <p className="meta-text font-medium">
                      Last Modified: <span className="text-slate-700">{cv.lastModified}</span>
                    </p>
                    <p className="meta-text font-medium">
                      Target Position: <span className="text-slate-700">{cv.targetPosition}</span>
                    </p>
                  </div>
                </div>

                <div className="px-2 py-3 border-t border-slate-100 grid grid-cols-4 gap-1">
                  <button className="flex flex-col items-center justify-center gap-1 p-1 hover:bg-slate-50 rounded text-slate-600 hover:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[10px] font-medium">Edit</span>
                  </button>

                  <button className="flex flex-col items-center justify-center gap-1 p-1 hover:bg-slate-50 rounded text-slate-600 hover:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[10px] font-medium">Download</span>
                  </button>

                  <button className="flex flex-col items-center justify-center gap-1 p-1 hover:bg-slate-50 rounded text-slate-600 hover:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[10px] font-medium">Preview</span>
                  </button>

                  {/* Delete Button */}
                  <button className="flex flex-col items-center justify-center gap-1 p-1 hover:bg-red-50 rounded text-slate-600 hover:text-red-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-[10px] font-medium">Delete</span>
                  </button>
                </div>
              </article>
            ))}

          </div>
        </div>
      </main>
    </div>
  );
};

export default SavedCV;