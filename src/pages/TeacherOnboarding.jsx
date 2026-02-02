import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.ts'

const STEPS = ['school', 'class', 'students']
const STEP_LABELS = ['Your School', 'First Class', 'Add Students']
const STEP_ICONS = ['🏫', '📝', '👥']

export default function TeacherOnboarding() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // School data
  const [schoolMode, setSchoolMode] = useState('create') // 'create' | 'join'
  const [schoolName, setSchoolName] = useState('')
  const [schoolDistrict, setSchoolDistrict] = useState('')
  const [schoolState, setSchoolState] = useState('')
  const [joinCode, setJoinCode] = useState('')

  // Class data
  const [className, setClassName] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')
  const [subject, setSubject] = useState('Reading')

  // Students data
  const [studentMode, setStudentMode] = useState('manual') // 'manual' | 'csv'
  const [students, setStudents] = useState([
    { name: '', username: '' },
    { name: '', username: '' },
    { name: '', username: '' },
  ])
  const [generatedCodes, setGeneratedCodes] = useState([])
  const fileInputRef = useRef(null)

  function nextStep() {
    setError(null)
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  function prevStep() {
    setError(null)
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  function addStudentRow() {
    setStudents([...students, { name: '', username: '' }])
  }

  function updateStudent(index, field, value) {
    const updated = [...students]
    updated[index][field] = value
    // Auto-generate username from name
    if (field === 'name' && !updated[index].username) {
      updated[index].username = value.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '')
    }
    setStudents(updated)
  }

  function removeStudent(index) {
    if (students.length > 1) {
      setStudents(students.filter((_, i) => i !== index))
    }
  }

  function handleCSVUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target.result
      const lines = text.split('\n').filter(Boolean)
      const parsed = lines.slice(1).map((line) => {
        const [name, username] = line.split(',').map((s) => s.trim().replace(/^"|"$/g, ''))
        return {
          name: name || '',
          username: username || name?.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '') || '',
        }
      }).filter((s) => s.name)

      if (parsed.length > 0) {
        setStudents(parsed)
      }
    }
    reader.readAsText(file)
  }

  function generateLoginCodes() {
    const codes = students
      .filter((s) => s.name.trim())
      .map((s) => ({
        name: s.name,
        username: s.username || s.name.toLowerCase().replace(/\s+/g, '.'),
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        password: generateFriendlyPassword(),
      }))
    setGeneratedCodes(codes)
  }

  function generateFriendlyPassword() {
    const adjectives = ['Happy', 'Brave', 'Swift', 'Clever', 'Bright', 'Kind', 'Bold', 'Calm']
    const animals = ['Owl', 'Fox', 'Bear', 'Deer', 'Lion', 'Wolf', 'Hawk', 'Frog']
    const numbers = Math.floor(Math.random() * 99) + 1
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
    const animal = animals[Math.floor(Math.random() * animals.length)]
    return `${adj}${animal}${numbers}`
  }

  async function handleFinish() {
    setLoading(true)
    setError(null)

    try {
      // In production, this would:
      // 1. Create/join school via Supabase
      // 2. Create class
      // 3. Create student accounts via Edge Function
      // 4. Mark onboarding as complete

      // For now, navigate to teacher dashboard
      navigate('/teacher', { replace: true })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 py-12 px-4 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-purple-200 rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <span className="text-sm">✨</span>
            <span className="text-sm font-medium text-rq-purple">Welcome to ReadQuest!</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            Let's Set Up Your <span className="bg-gradient-to-r from-rq-purple to-rq-teal bg-clip-text text-transparent">Classroom</span>
          </h1>
          <p className="text-rq-muted text-sm">This takes about 5 minutes. You can always change these later.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <button
                onClick={() => i < currentStep && setCurrentStep(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  i === currentStep
                    ? 'bg-gradient-to-r from-rq-purple to-rq-purple-light text-white shadow-lg shadow-purple-200'
                    : i < currentStep
                    ? 'bg-green-100 text-green-700 cursor-pointer hover:bg-green-200'
                    : 'bg-gray-100 text-rq-muted'
                }`}
              >
                <span>{i < currentStep ? '✓' : STEP_ICONS[i]}</span>
                <span className="hidden sm:inline">{STEP_LABELS[i]}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 rounded ${i < currentStep ? 'bg-green-300' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm animate-slide-up">
            ⚠️ {error}
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl shadow-purple-100/50 border border-purple-100 p-8 animate-slide-up">

          {/* Step 1: School */}
          {currentStep === 0 && (
            <div>
              <h2 className="font-display text-xl font-bold mb-1 flex items-center gap-2">
                🏫 Your School
              </h2>
              <p className="text-sm text-rq-muted mb-6">Create a new school or join an existing one.</p>

              {/* Mode Toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setSchoolMode('create')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    schoolMode === 'create'
                      ? 'bg-gradient-to-r from-rq-purple to-rq-purple-light text-white shadow-md'
                      : 'bg-purple-50 text-rq-muted hover:bg-purple-100'
                  }`}
                >
                  ✨ Create New
                </button>
                <button
                  type="button"
                  onClick={() => setSchoolMode('join')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    schoolMode === 'join'
                      ? 'bg-gradient-to-r from-rq-teal to-rq-teal-light text-white shadow-md'
                      : 'bg-teal-50 text-rq-muted hover:bg-teal-100'
                  }`}
                >
                  🔗 Join Existing
                </button>
              </div>

              {schoolMode === 'create' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-rq-text mb-1.5">School Name</label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g., Sunset Elementary School"
                      className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-rq-purple focus:ring-2 focus:ring-purple-200 outline-none text-sm transition-all placeholder:text-gray-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-rq-text mb-1.5">District <span className="text-rq-muted font-normal">(optional)</span></label>
                      <input
                        type="text"
                        value={schoolDistrict}
                        onChange={(e) => setSchoolDistrict(e.target.value)}
                        placeholder="School district"
                        className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-rq-purple focus:ring-2 focus:ring-purple-200 outline-none text-sm transition-all placeholder:text-gray-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-rq-text mb-1.5">State</label>
                      <select
                        value={schoolState}
                        onChange={(e) => setSchoolState(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-rq-purple focus:ring-2 focus:ring-purple-200 outline-none text-sm transition-all bg-white"
                      >
                        <option value="">Select…</option>
                        {['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-rq-text mb-1.5">School Join Code</label>
                    <input
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="Enter the code from your admin"
                      maxLength={8}
                      className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-rq-purple focus:ring-2 focus:ring-purple-200 outline-none text-sm transition-all placeholder:text-gray-300 uppercase tracking-widest text-center font-mono text-lg"
                    />
                    <p className="text-xs text-rq-muted mt-2">Ask your school administrator for this code.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Class */}
          {currentStep === 1 && (
            <div>
              <h2 className="font-display text-xl font-bold mb-1 flex items-center gap-2">
                📝 Create Your First Class
              </h2>
              <p className="text-sm text-rq-muted mb-6">You can add more classes later from your dashboard.</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-rq-text mb-1.5">Class Name</label>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="e.g., 3rd Grade Reading — Period 1"
                    className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-rq-purple focus:ring-2 focus:ring-purple-200 outline-none text-sm transition-all placeholder:text-gray-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-rq-text mb-1.5">Grade Level</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-rq-purple focus:ring-2 focus:ring-purple-200 outline-none text-sm transition-all bg-white"
                    >
                      <option value="">Select…</option>
                      <option value="K">Kindergarten</option>
                      <option value="1">1st Grade</option>
                      <option value="2">2nd Grade</option>
                      <option value="3">3rd Grade</option>
                      <option value="4">4th Grade</option>
                      <option value="5">5th Grade</option>
                      <option value="6">6th Grade</option>
                      <option value="7">7th Grade</option>
                      <option value="8">8th Grade</option>
                      <option value="9">9th Grade</option>
                      <option value="10">10th Grade</option>
                      <option value="11">11th Grade</option>
                      <option value="12">12th Grade</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-rq-text mb-1.5">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 focus:border-rq-purple focus:ring-2 focus:ring-purple-200 outline-none text-sm transition-all bg-white"
                    >
                      <option value="Reading">Reading</option>
                      <option value="ELA">English Language Arts</option>
                      <option value="Homeroom">Homeroom</option>
                      <option value="Library">Library</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Preview card */}
                {className && (
                  <div className="bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl p-4 border border-purple-100 animate-slide-up">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rq-purple to-rq-teal flex items-center justify-center text-white text-lg">
                        📝
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-rq-text">{className}</div>
                        <div className="text-xs text-rq-muted">
                          {gradeLevel ? `Grade ${gradeLevel}` : 'No grade'} · {subject} · 0 students
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Students */}
          {currentStep === 2 && (
            <div>
              <h2 className="font-display text-xl font-bold mb-1 flex items-center gap-2">
                👥 Add Students
              </h2>
              <p className="text-sm text-rq-muted mb-6">
                Add students now or skip and do it later from your dashboard.
              </p>

              {/* Import mode toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setStudentMode('manual')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    studentMode === 'manual'
                      ? 'bg-gradient-to-r from-rq-purple to-rq-purple-light text-white shadow-md'
                      : 'bg-purple-50 text-rq-muted hover:bg-purple-100'
                  }`}
                >
                  ✏️ Manual Entry
                </button>
                <button
                  type="button"
                  onClick={() => setStudentMode('csv')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    studentMode === 'csv'
                      ? 'bg-gradient-to-r from-rq-teal to-rq-teal-light text-white shadow-md'
                      : 'bg-teal-50 text-rq-muted hover:bg-teal-100'
                  }`}
                >
                  📄 CSV Upload
                </button>
              </div>

              {studentMode === 'csv' && (
                <div className="mb-6">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-purple-200 rounded-xl p-8 text-center cursor-pointer hover:border-rq-purple hover:bg-purple-50/30 transition-all group"
                  >
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📁</div>
                    <p className="text-sm font-semibold text-rq-text mb-1">Drop CSV file here or click to browse</p>
                    <p className="text-xs text-rq-muted">Format: name, username (one student per line)</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="hidden"
                  />
                  <div className="mt-2 bg-gray-50 rounded-lg p-3 text-xs font-mono text-rq-muted">
                    <div className="font-semibold text-rq-text mb-1">Example CSV:</div>
                    <div>name,username</div>
                    <div>Jayden Martinez,jayden.m</div>
                    <div>Sophia Roberts,sophia.r</div>
                    <div>Ava Chen,ava.c</div>
                  </div>
                </div>
              )}

              {/* Student list */}
              <div className="space-y-3 mb-4">
                {students.map((student, i) => (
                  <div key={i} className="flex items-center gap-2 animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    <span className="text-sm text-rq-muted w-6 text-right">{i + 1}.</span>
                    <input
                      type="text"
                      value={student.name}
                      onChange={(e) => updateStudent(i, 'name', e.target.value)}
                      placeholder="Student name"
                      className="flex-1 px-3 py-2.5 rounded-xl border-2 border-purple-100 focus:border-rq-purple focus:ring-2 focus:ring-purple-200 outline-none text-sm transition-all placeholder:text-gray-300"
                    />
                    <input
                      type="text"
                      value={student.username}
                      onChange={(e) => updateStudent(i, 'username', e.target.value)}
                      placeholder="username"
                      className="w-32 px-3 py-2.5 rounded-xl border-2 border-purple-100 focus:border-rq-purple focus:ring-2 focus:ring-purple-200 outline-none text-sm transition-all placeholder:text-gray-300 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => removeStudent(i)}
                      className="text-rq-muted hover:text-red-500 transition-colors p-1"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addStudentRow}
                className="w-full py-2.5 rounded-xl border-2 border-dashed border-purple-200 text-sm font-semibold text-rq-purple hover:bg-purple-50 hover:border-rq-purple transition-all"
              >
                + Add Another Student
              </button>

              {/* Generate Codes */}
              {students.some((s) => s.name.trim()) && !generatedCodes.length && (
                <button
                  type="button"
                  onClick={generateLoginCodes}
                  className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-rq-teal to-rq-teal-light text-white text-sm font-bold hover:shadow-lg hover:shadow-teal-200 transition-all hover:-translate-y-0.5"
                >
                  🔑 Generate Login Codes
                </button>
              )}

              {/* Generated Codes Display */}
              {generatedCodes.length > 0 && (
                <div className="mt-6 animate-slide-up">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-bold text-sm">Student Login Cards</h3>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="text-xs font-semibold text-rq-purple hover:text-rq-purple-dark transition-colors flex items-center gap-1"
                    >
                      🖨️ Print Cards
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {generatedCodes.map((student, i) => (
                      <div
                        key={i}
                        className="bg-gradient-to-br from-purple-50 to-teal-50 rounded-xl p-4 border border-purple-100 text-center"
                      >
                        <div className="text-2xl mb-1">📚</div>
                        <div className="font-display font-bold text-sm text-rq-text">{student.name}</div>
                        <div className="mt-2 space-y-1">
                          <div className="bg-white rounded-lg py-1.5 px-3">
                            <div className="text-[10px] text-rq-muted uppercase tracking-wide">Username</div>
                            <div className="font-mono font-bold text-sm text-rq-purple">{student.username}</div>
                          </div>
                          <div className="bg-white rounded-lg py-1.5 px-3">
                            <div className="text-[10px] text-rq-muted uppercase tracking-wide">Password</div>
                            <div className="font-mono font-bold text-sm text-rq-teal">{student.password}</div>
                          </div>
                          <div className="bg-white rounded-lg py-1.5 px-3">
                            <div className="text-[10px] text-rq-muted uppercase tracking-wide">Class Code</div>
                            <div className="font-mono font-bold text-sm text-rq-orange">{student.code}</div>
                          </div>
                        </div>
                        {/* QR Code placeholder */}
                        <div className="mt-2 mx-auto w-16 h-16 bg-white rounded-lg border border-purple-100 flex items-center justify-center">
                          <div className="grid grid-cols-4 gap-px">
                            {Array.from({ length: 16 }).map((_, j) => (
                              <div
                                key={j}
                                className={`w-2.5 h-2.5 rounded-sm ${
                                  Math.random() > 0.5 ? 'bg-rq-purple' : 'bg-transparent'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-[9px] text-rq-muted mt-1">Scan to login</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-rq-muted mt-3 text-center">
                    💡 Print these cards and hand them to students. QR codes will work once Supabase is connected.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-purple-50">
            <button
              type="button"
              onClick={prevStep}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                currentStep === 0
                  ? 'invisible'
                  : 'text-rq-muted hover:text-rq-purple hover:bg-purple-50'
              }`}
            >
              ← Back
            </button>
            <div className="flex gap-3">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={() => navigate('/teacher', { replace: true })}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-rq-muted hover:text-rq-purple hover:bg-purple-50 transition-all"
                >
                  Skip for Now
                </button>
              )}
              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rq-purple to-rq-purple-light text-white text-sm font-bold hover:shadow-lg hover:shadow-purple-200 transition-all hover:-translate-y-0.5"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rq-purple to-rq-teal text-white text-sm font-bold hover:shadow-lg hover:shadow-purple-200 transition-all hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Setting up…
                    </span>
                  ) : (
                    '🚀 Launch My Classroom'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Help text */}
        <p className="text-center text-xs text-rq-muted mt-6">
          Need help? <a href="mailto:support@pshindustries.com" className="text-rq-purple font-medium hover:underline">Contact support</a> or check our{' '}
          <a href="/help" className="text-rq-purple font-medium hover:underline">setup guide</a>.
        </p>
      </div>
    </div>
  )
}
