'use client';

import React, { useState } from 'react';
import { Shield, Lock, Bell, Cloud, Eye, Search} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TrustWalletHomepage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'mobile' | 'extension'>('mobile');




  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <button className="p-2">
            <div className="space-y-1.5">
              <div className="w-6 h-0.5 bg-blue-600"></div>
              <div className="w-6 h-0.5 bg-blue-600"></div>
              <div className="w-6 h-0.5 bg-blue-600"></div>
            </div>
          </button>
        </div>
      </header>

      {/* Hero Section */}
<section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
  <div className="max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          True crypto ownership. Powerful Web3 experiences
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Unlock the power of your cryptocurrency assets and explore the world of Web3 with Trust Wallet.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/auth/register')}
            className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <div className="w-5 h-5 border-2 border-blue-600 rounded"></div>
            Create Account
          </button>
          <button
            onClick={() => router.push('/auth/login')}
            className="px-8 py-4 bg-white border-2 border-blue-600 text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <div className="w-5 h-5 border-2 border-blue-600 rounded"></div>
            Login
          </button>
        </div>
      </div>
            <div className="relative">
              <div className="relative z-10 flex items-center justify-center gap-4">
                <div className="bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-6 rounded-3xl shadow-xl">
                  <div className="bg-gray-900 rounded-2xl p-6 w-64">
                    <div className="text-white text-sm mb-2">My Wallet 1</div>
                    <div className="text-white text-3xl font-bold mb-4">$1,228.20</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white text-sm">
                        <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                        <span>Ethereum</span>
                      </div>
                      <div className="flex items-center gap-2 text-white text-sm">
                        <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                        <span>Polygon</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Trusted by</div>
              <div className="text-3xl font-bold text-blue-600">200M</div>
              <div className="text-sm text-gray-900">people</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Founded in</div>
              <div className="text-3xl font-bold text-blue-600">2017</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Independently</div>
              <div className="text-3xl font-bold text-blue-600">Audited</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">ISO</div>
              <div className="text-3xl font-bold text-blue-600">Certified</div>
            </div>
          </div>
          <div className="text-center mt-8">
            <div className="text-lg font-semibold text-gray-900">Top reviews</div>
            <div className="flex justify-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-blue-600 text-2xl">★</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RWAs Banner */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-3xl font-bold mb-2">
                Introducing <span className="text-blue-600">RWAs</span>
              </h3>
              <p className="text-xl">
                <span className="font-semibold">SWAP TOKENIZED STOCKS & ETFS</span>
              </p>
              <p className="text-sm text-gray-600 mt-2">Live on: ETH • Brought to you by: Ondo & linch</p>
            </div>
            <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition">
              Explore
            </button>
          </div>
        </div>
      </section>

      {/* Building on Trust */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Building on Trust</h2>
                <p className="text-lg mb-6">
                  We know that working together as a community is better for everyone. Our platform enables blockchain developers to build their dApps and wallets natively and connect with millions of users, without having to worry about the low-level implementation details.
                </p>
                <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition">
                  Check out our Developer Docs
                </button>
              </div>
              <div className="flex justify-center">
                <div className="w-64 h-64 bg-gradient-to-br from-green-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <div className="text-6xl">🤖</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 px-4 bg-gradient-to-b from-blue-500 to-cyan-400">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            One Platform, Millions of Assets
          </h2>
          <p className="text-white text-center mb-8 text-lg">
            As a leading self-custody multi-chain platform, we support millions of assets across 100+ blockchains. From Bitcoin, Ethereum, and Solana, to Cosmos, Optimism, and much more.
          </p>

          <div className="bg-white rounded-2xl p-6 mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search a chain..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Chain</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Buy</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Sell</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Swap</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Earn</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">dApps</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-900 rounded-full"></div>
                      <span className="font-medium">Solana (SOL)</span>
                    </td>
                    <td className="text-center"><span className="text-blue-600 text-xl">✓</span></td>
                    <td className="text-center"><span className="text-blue-600 text-xl">✓</span></td>
                    <td className="text-center"><span className="text-blue-600 text-xl">✓</span></td>
                    <td className="text-center"><span className="text-blue-600 text-xl">✓</span></td>
                    <td className="text-center"><span className="text-gray-400 text-xl">✕</span></td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-4 px-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-400 rounded-full"></div>
                      <span className="font-medium">Sui (SUI)</span>
                    </td>
                    <td className="text-center"><span className="text-blue-600 text-xl">✓</span></td>
                    <td className="text-center"><span className="text-blue-600 text-xl">✓</span></td>
                    <td className="text-center"><span className="text-gray-400 text-xl">✕</span></td>
                    <td className="text-center"><span className="text-blue-600 text-xl">✓</span></td>
                    <td className="text-center"><span className="text-gray-400 text-xl">✕</span></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                      <span className="font-medium">Ethereum (ETH)</span>
                    </td>
                    <td className="text-center"><span className="text-blue-600 text-xl">✓</span></td>
                    <td className="text-center"><span className="text-blue-600 text-xl">✓</span></td>
                    <td className="text-center"><span className="text-blue-600 text-xl">✓</span></td>
                    <td className="text-center"><span className="text-blue-600 text-xl">✓</span></td>
                    <td className="text-center"><span className="text-blue-600 text-xl">✓</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center">
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-4xl font-bold text-white">10M+</div>
                <div className="text-white">Assets</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white">600M+</div>
                <div className="text-white">NFTs</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white">100+</div>
                <div className="text-white">Blockchains</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* dApp Browser */}
      <section className="py-16 px-4 bg-gradient-to-b from-pink-100 to-yellow-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Browse a world of dApps
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Access Web3 and DeFi opportunities via our dApp browser.
          </p>

          <div className="bg-white rounded-3xl p-8 md:p-12 mb-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">Deposit crypto easily from exchanges</h3>
                <p className="text-gray-600 mb-6">
                  Take control of your crypto. Avoid complicated steps and deposit directly to your wallet from exchanges like Binance and Coinbase.
                </p>
                <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition">
                  Get started with deposits
                </button>
              </div>
              <div className="flex justify-center">
                <div className="bg-gray-900 rounded-3xl p-8 w-64">
                  <div className="text-white text-center">
                    <div className="w-32 h-32 bg-white mx-auto mb-4 rounded-lg"></div>
                    <div className="text-sm">QR Code Scanner</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-yellow-100 to-green-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-4">
            Zero personal tracking
          </h2>
          <p className="text-center text-gray-700 mb-12 text-lg">
            We secure your wallet, but don&apos;t control or have access to your private keys or secret phrase - only you do.
          </p>

          <div className="bg-white rounded-3xl p-8 md:p-12 mb-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">True ownership of your crypto assets</h3>
                <p className="text-gray-600 mb-6">
                  We secure your wallet, but don&apos;t control or have access to your private keys or secret phrase - only you do.
                </p>
                <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition">
                  Get Started
                </button>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <Lock className="w-32 h-32 text-blue-600" />
                  <Shield className="w-20 h-20 text-green-400 absolute -bottom-4 -right-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <Cloud className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold mb-2">Added security with encryption</h4>
              <p className="text-gray-600">Use our Encrypted Cloud Backup for increased wallet security.</p>
            </div>
            <div className="bg-white rounded-2xl p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold mb-2">Zero personal tracking</h4>
              <p className="text-gray-600">We don&apos;t track any personal information, including your IP address or balances.</p>
            </div>
            <div className="bg-white rounded-2xl p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold mb-2">Proactive alerts for risky transactions</h4>
              <p className="text-gray-600">Stay safe with alerts for risky address and dApp connections.</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="px-8 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-full font-semibold hover:bg-gray-50 transition">
              Learn more about privacy & security
            </button>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Your one-stop, Web3 wallet</h2>
                <p className="text-gray-600 mb-6">
                  Buy, sell, and swap crypto, earn rewards, manage NFTs, and discover DApps, all in one place.
                </p>
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setActiveTab('mobile')}
                    className={`px-6 py-2 rounded-full font-semibold transition ${
                      activeTab === 'mobile'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Mobile
                  </button>
                  <button
                    onClick={() => setActiveTab('extension')}
                    className={`px-6 py-2 rounded-full font-semibold transition ${
                      activeTab === 'extension'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Extension
                  </button>
                </div>
                <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition">
                  Download Mobile App
                </button>
              </div>
              <div className="flex justify-center">
                <div className="bg-gray-900 rounded-3xl p-4 w-64">
                  <div className="bg-gray-800 rounded-2xl p-6 text-white">
                    <div className="text-center mb-6">Buy BTC</div>
                    <div className="text-4xl font-bold mb-8 text-center">$100</div>
                    <div className="bg-green-400 rounded-xl p-4 mb-4">
                      <div className="text-sm text-gray-900">Bank Transfer</div>
                      <div className="text-xs text-gray-700">with MoonPay</div>
                    </div>
                    <div className="bg-green-400 rounded-xl p-4 text-center font-semibold text-gray-900">
                      Buy with MoonPay
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Enjoy a Web3 experience powered by community
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Join our vibrant and diverse community to learn about the power of self-custody, crypto, and Web3.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="rounded-2xl overflow-hidden">
              <Image fill src="/api/placeholder/400/300" alt="Community member" className="w-full h-64 object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <Image fill src="/api/placeholder/400/300" alt="Community event" className="w-full h-64 object-cover" />
            </div>
            <div className="rounded-2xl overflow-hidden">
              <Image fill src="/api/placeholder/400/300" alt="Community gathering" className="w-full h-64 object-cover" />
            </div>
          </div>

          <div className="text-center">
            <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition">
              Join our community on Telegram
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Stay Connected:</h3>
            <div className="flex justify-center gap-4">
              {['F', 'G', 'I', 'X', 'D', 'R', 'T', 'Y'].map((social, i) => (
                <div key={i} className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white font-semibold">
                  {social}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">Wallet</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Mobile App</li>
                <li>Browser Extension</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Buy Crypto</li>
                <li>Swaps</li>
                <li>Staking</li>
                <li>NFTs</li>
                <li>Security</li>
                <li>SWIFT: Smart Contract Wallet</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Build</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Developer Docs</li>
                <li>Wallet Core</li>
                <li>Submit dApp</li>
                <li>Get assets listed</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>FAQ</li>
                <li>Contact Us</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>About Us</li>
                <li>Careers</li>
                <li>Press Kit</li>
                <li>Terms of Service</li>
                <li>Privacy Notice</li>
                <li>Cookie Preferences</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <div className="w-20 h-20 border-2 border-gray-300 rounded-lg"></div>
            <div className="w-20 h-20 border-2 border-gray-300 rounded-lg"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}