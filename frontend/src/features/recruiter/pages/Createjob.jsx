import React, { useState, useEffect } from 'react';
import './CreateJobPost.css';

const CreateJobPost = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Senior Product Designer',
    description: '',
    location: 'San Francisco, CA',
    experience: '',
    workModel: '',
    salary: '120k - 150k',
    expiration: ''
  });
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={`app-container mesh-bg-light ${darkMode ? 'dark' : ''} text-gray-900 dark:text-gray-100 overflow-x-hidden selection:bg-purple-600 selection:text-white`}>

      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/20 blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[100px]"></div>
      </div>

      <nav className="glass glass-dark sticky top-0 z-50 border-b border-white/20 dark:border-gray-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
                <span className="material-symbols-outlined text-2xl">work_outline</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                UTH Workplace
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <button className="relative p-2 rounded-full text-gray-500 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
              </button>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] cursor-pointer hover:shadow-glow transition-shadow duration-300">
                <div className="h-full w-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                  <span className="font-bold text-sm text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">JS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          <div className="lg:col-span-7 space-y-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Create Job Post</h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">Craft your perfect job listing to attract top talent.</p>
            </div>

            <form action="#" className="glass glass-dark rounded-3xl p-8 space-y-8 relative overflow-hidden transition-all duration-200" method="POST">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-20"></div>

              <div className="space-y-6">

                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1" htmlFor="job-title">Job Title</label>
                  <div className="relative transition-all duration-300 transform group-focus-within:scale-[1.01]">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">badge</span>
                    </div>
                    <input
                      className="block w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 border-0 ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm group-focus-within:shadow-glow hover:bg-white dark:hover:bg-gray-800"
                      id="job-title"
                      name="title"
                      placeholder="e.g. Senior Product Designer"
                      type="text"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>


                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1" htmlFor="description">Description</label>
                  <div className="relative transition-all duration-300 transform group-focus-within:scale-[1.01]">
                    <textarea
                      className="block w-full p-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 border-0 ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm group-focus-within:shadow-glow hover:bg-white dark:hover:bg-gray-800 min-h-[200px] resize-y"
                      id="description"
                      name="description"
                      placeholder="Describe the role, responsibilities, and what makes your company unique..."
                      onChange={handleInputChange}
                    ></textarea>
                    <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-md backdrop-blur-sm">
                      {formData.description.length}/2000
                    </div>
                  </div>
                </div>


                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1" htmlFor="address">Location</label>
                  <div className="relative transition-all duration-300 transform group-focus-within:scale-[1.01]">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">location_on</span>
                    </div>
                    <input
                      className="block w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 border-0 ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm group-focus-within:shadow-glow hover:bg-white dark:hover:bg-gray-800"
                      id="address"
                      name="location"
                      placeholder="e.g. San Francisco, CA"
                      type="text"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1" htmlFor="experience">Experience</label>
                    <div className="relative transition-all duration-300 transform group-focus-within:scale-[1.01]">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">military_tech</span>
                      </div>
                      <input
                        className="block w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 border-0 ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm group-focus-within:shadow-glow hover:bg-white dark:hover:bg-gray-800"
                        id="experience"
                        name="experience"
                        placeholder="Years"
                        step="1"
                        type="number"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1" htmlFor="work-model">Work Model</label>
                    <div className="relative transition-all duration-300 transform group-focus-within:scale-[1.01]">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">apartment</span>
                      </div>
                      <select
                        className="block w-full pl-12 pr-10 py-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 border-0 ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white transition-all shadow-sm group-focus-within:shadow-glow hover:bg-white dark:hover:bg-gray-800 appearance-none cursor-pointer"
                        id="work-model"
                        name="workModel"
                        defaultValue=""
                        onChange={handleInputChange}
                      >
                        <option disabled value="">Select Model</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="On-site">On-site</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400">expand_more</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1" htmlFor="salary">Salary Range</label>
                    <div className="relative transition-all duration-300 transform group-focus-within:scale-[1.01]">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">attach_money</span>
                      </div>
                      <input
                        className="block w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 border-0 ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm group-focus-within:shadow-glow hover:bg-white dark:hover:bg-gray-800"
                        id="salary"
                        name="salary"
                        placeholder="e.g. 120k - 150k"
                        type="text"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-1" htmlFor="expiration">Expiration Date</label>
                    <div className="relative transition-all duration-300 transform group-focus-within:scale-[1.01]">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">calendar_today</span>
                      </div>
                      <input
                        className="block w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 border-0 ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-purple-500/50 text-gray-900 dark:text-white placeholder-gray-400 transition-all shadow-sm group-focus-within:shadow-glow hover:bg-white dark:hover:bg-gray-800"
                        id="expiration"
                        name="expiration"
                        type="date"
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              </div>


              <div className="pt-6 flex items-center justify-between border-t border-gray-200/50 dark:border-gray-700/50">
                <button type="button" className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors px-4 py-2">
                  Cancel
                </button>
                <button type="submit" className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white transition-all duration-200 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl hover:shadow-lg hover:shadow-purple-600/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 overflow-hidden">
                  <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                  <span className="relative flex items-center gap-2">Publish Job <span className="material-symbols-outlined text-sm">arrow_forward</span></span>
                </button>
              </div>
            </form>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
              By publishing, you agree to our <a href="#" className="text-primary hover:text-indigo-600 underline decoration-dotted">Terms</a> and <a href="#" className="text-primary hover:text-indigo-600 underline decoration-dotted">Privacy Policy</a>.
            </p>
          </div>

          <div className="lg:col-span-5 hidden lg:block">
            <div className="sticky top-28 space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Real-time Preview
                </span>
                <span className="text-xs text-gray-400">Candidate View</span>
              </div>

              <div className="glass glass-dark rounded-3xl p-6 shadow-2xl border-t border-white/60 dark:border-gray-700 transition-colors duration-200">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-4">
                    <div className="h-14 w-14 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                      <span className="text-2xl font-bold text-gray-400">L</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1">
                        {formData.title || 'Job Title'}
                      </h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                        <span>UTH Workplace</span>
                        <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                        <span>{formData.location || 'Location'}</span>
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 cursor-not-allowed">bookmark</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {formData.workModel && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
                      {formData.workModel}
                    </span>
                  )}
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                    Full-time
                  </span>
                  {formData.salary && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-100 dark:border-green-800">
                      ${formData.salary}
                    </span>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">About the role</h4>

                  {!formData.description && (
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-[90%]"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-[95%]"></div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-[80%]"></div>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 whitespace-pre-line">
                    {formData.description || 'We are looking for a creative and detail-oriented person to join our team...'}
                  </p>
                </div>

                <button disabled className="w-full py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm hover:opacity-90 transition-opacity cursor-not-allowed flex items-center justify-center gap-2">
                  Apply Now <span className="material-symbols-outlined text-sm">open_in_new</span>
                </button>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-9xl opacity-10 rotate-12">lightbulb</span>
                <h4 className="font-bold mb-2 relative z-10 flex items-center gap-2">
                  <span className="material-symbols-outlined text-yellow-300">tips_and_updates</span> Pro Tip
                </h4>
                <p className="text-sm text-indigo-100 relative z-10">
                  Detailed job descriptions with clear salary ranges get 40% more qualified applicants on UTH Workplace.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>


      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-4 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition-all hover:scale-110 active:scale-90"
        >
          {darkMode ? (
            <span className="material-symbols-outlined block">light_mode</span>
          ) : (
            <span className="material-symbols-outlined block">dark_mode</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateJobPost;