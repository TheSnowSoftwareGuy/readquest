import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-rq-text text-white/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📚</span>
              <span className="font-display font-bold text-xl text-white">ReadQuest</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Making every child a reader through AI-powered discovery, social motivation, and game-like engagement.
            </p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/demo" className="hover:text-white transition-colors">Try Demo</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">For Schools</a></li>
              <li><a href="#" className="hover:text-white transition-colors">For Districts</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Legal & Safety</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/coppa" className="hover:text-white transition-colors">COPPA Compliance</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">FERPA Compliance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Data Security</a></li>
            </ul>
            <div className="mt-4 flex gap-2">
              <span className="bg-white/10 rounded px-2 py-1 text-xs">🔒 COPPA</span>
              <span className="bg-white/10 rounded px-2 py-1 text-xs">🛡️ FERPA</span>
              <span className="bg-white/10 rounded px-2 py-1 text-xs">✅ SOC 2</span>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/40">© 2026 PSH Industries. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-white/40 hover:text-white transition-colors text-xl">𝕏</a>
            <a href="#" className="text-white/40 hover:text-white transition-colors text-lg">in</a>
            <a href="#" className="text-white/40 hover:text-white transition-colors text-lg">📸</a>
            <a href="#" className="text-white/40 hover:text-white transition-colors text-lg">▶️</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
