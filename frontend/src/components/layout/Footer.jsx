import { Link } from 'react-router-dom'
import { MdOutlineLocalFlorist } from 'react-icons/md'
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white mt-20">
      <div className="page-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <MdOutlineLocalFlorist className="text-green-300 text-2xl" />
              <span className="font-bold text-xl">GardenFresh</span>
            </div>
            <p className="text-green-200 text-sm leading-relaxed">
              Connecting home growers and small farmers directly with customers. Fresh, local, naturally grown.
            </p>
            <div className="flex gap-4 mt-5">
              <a href="#" className="text-green-300 hover:text-white transition-colors"><FiInstagram className="text-xl" /></a>
              <a href="#" className="text-green-300 hover:text-white transition-colors"><FiTwitter className="text-xl" /></a>
              <a href="#" className="text-green-300 hover:text-white transition-colors"><FiFacebook className="text-xl" /></a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-green-100">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-green-300">
              {[['Marketplace', '/marketplace'], ['About Us', '/about'], ['Contact', '/contact']].map(([l, h]) => (
                <li key={l}><Link to={h} className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-green-100">For Growers</h4>
            <ul className="space-y-2.5 text-sm text-green-300">
              {[['Sell on GardenFresh', '/register'], ['Farmer Dashboard', '/farmer'], ['How it Works', '/about']].map(([l, h]) => (
                <li key={l}><Link to={h} className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-green-100">Contact</h4>
            <ul className="space-y-2.5 text-sm text-green-300">
              <li>support@gardenfresh.in</li>
              <li>+91 98765 43210</li>
              <li>Udupi, Karnataka 576101</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-green-800 mt-10 pt-6 flex flex-col md:flex-row justify-between text-sm text-green-400 gap-3">
          <p>© {new Date().getFullYear()} GardenFresh. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
