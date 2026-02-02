import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { sampleBooks } from '../data/mockData'
import ReviewForm from '../components/ReviewForm'
import ReviewsList from '../components/ReviewsList'

export default function BookDetail() {
  const { id } = useParams()
  const book = sampleBooks.find(b => b.id === id) || sampleBooks[0]
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewsKey, setReviewsKey] = useState(0)

  function handleReviewSubmitted(review) {
    // Refresh reviews list by changing the key
    setReviewsKey((k) => k + 1)
    setShowReviewForm(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/student" className="text-sm text-rq-purple hover:underline mb-6 inline-block">← Back to Dashboard</Link>
      <div className="bg-white rounded-2xl border border-purple-50 shadow-sm overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 bg-gradient-to-br from-purple-100 to-teal-100 p-8 flex items-center justify-center">
            <img src={book.cover} alt={book.title} className="w-48 rounded-xl shadow-lg" onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"><rect fill="%236C3CE1" width="200" height="300" rx="8"/><text x="100" y="160" text-anchor="middle" fill="white" font-size="60">📖</text></svg>' }} />
          </div>
          <div className="md:w-2/3 p-8">
            <h1 className="font-display text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-lg text-rq-muted mb-4">by {book.author}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {book.genres.map((g, i) => (
                <span key={i} className="bg-purple-100 text-rq-purple text-xs px-3 py-1 rounded-full font-medium">{g}</span>
              ))}
              <span className="bg-teal-100 text-rq-teal text-xs px-3 py-1 rounded-full font-medium">{book.lexile}</span>
              <span className="bg-gray-100 text-rq-muted text-xs px-3 py-1 rounded-full font-medium">{book.pages} pages</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400 text-xl">★</span>
              <span className="font-bold text-lg">{book.rating}</span>
              <span className="text-rq-muted text-sm">(1,247 ratings)</span>
            </div>
            <p className="text-rq-muted mb-6 leading-relaxed">{book.description}</p>
            <div className="flex gap-3 flex-wrap">
              <button className="bg-gradient-to-r from-rq-purple to-rq-purple-light text-white px-6 py-2.5 rounded-full font-bold hover:shadow-lg transition-all">
                📖 Add to Shelf
              </button>
              <button className="bg-teal-100 text-rq-teal px-6 py-2.5 rounded-full font-bold hover:bg-teal-200 transition-colors">
                ⏱️ Start Reading
              </button>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className={`px-6 py-2.5 rounded-full font-bold transition-colors ${
                  showReviewForm
                    ? 'bg-rq-purple text-white'
                    : 'bg-gray-100 text-rq-muted hover:bg-gray-200'
                }`}
              >
                ✍️ Write Review
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form (toggle) */}
      {showReviewForm && (
        <div className="mt-6">
          <ReviewForm
            bookId={book.id}
            bookTitle={book.title}
            onSubmit={handleReviewSubmitted}
            onCancel={() => setShowReviewForm(false)}
          />
        </div>
      )}

      {/* Reviews List */}
      <div className="mt-8">
        <ReviewsList key={reviewsKey} bookId={book.id} />
      </div>
    </div>
  )
}
