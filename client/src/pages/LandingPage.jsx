import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-primary">
          SupportBot
        </Link>
        <nav className="text-sm text-gray-600 flex items-center gap-6">
          <a href="#features" className="hover:text-primary transition">Features</a>
          <a href="#admin" className="hover:text-primary transition">Admin</a>
          <a href="#contact" className="hover:text-primary transition">Contact</a>
          <Link to="/admin" className="px-4 py-2 rounded-full bg-primary text-white font-medium shadow hover:bg-blue-600 transition">
            Admin Login
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-blue-100 text-primary text-sm font-medium">
            Customer Support Automation
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Launch a customer support chatbot in minutes.
          </h1>
          <p className="text-lg text-gray-600">
            SupportBot combines intelligent automation with your FAQ knowledge base to deliver instant answers to your customers — all without compromising on human touch.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/chat"
              className="px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-blue-600 transition font-semibold"
            >
              Start Chat
            </Link>
            <a
              href="#features"
              className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-blue-50 transition font-semibold"
            >
              Explore Features
            </a>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100">
          <div className="grid gap-4">
            <div className="bg-gray-50 rounded-2xl p-6">
              <p className="text-sm text-gray-500">Latest Support Bot Reply</p>
              <p className="text-gray-800 font-medium mt-2">
                “Hi Jamie, I can see your order #4822 is scheduled for delivery tomorrow. You’ll receive an SMS confirmation with tracking details soon.”
              </p>
            </div>
            <div className="bg-blue-500 text-white rounded-2xl p-6">
              <p className="text-sm text-blue-100">AI Insights</p>
              <p className="mt-2 font-medium">
                Average response time: <span className="font-semibold">1.2s</span>
              </p>
              <p className="font-medium">
                FAQ coverage: <span className="font-semibold">87%</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary font-semibold text-lg">
                SB
              </div>
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-500">Trusted by support teams</p>
                <p className="font-semibold text-gray-900">High performance, ready to deploy.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Everything you need to delight customers</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[{
            title: 'Hybrid Knowledge Base',
            description: 'Blend AI-driven responses with curated FAQ entries for consistent support experiences.'
          }, {
            title: 'Admin Dashboard',
            description: 'Maintain FAQs, review conversations, and export insights in seconds.'
          }, {
            title: 'Fast Setup',
            description: 'Docker-ready deployment, environment-configured, and Tailwind-styled UI out of the box.'
          }].map((feature) => (
            <div key={feature.title} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 mt-3">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Ready to launch your support automation?</h2>
          <p className="mt-4 text-gray-600">
            Connect SupportBot to your existing workflows. Configure FAQs, plug in your OpenAI key, and you’re ready to go live.
          </p>
          <Link
            to="/chat"
            className="mt-8 inline-flex px-6 py-3 bg-primary text-white rounded-lg shadow hover:bg-blue-600 transition font-semibold"
          >
            Try the Chat Experience
          </Link>
        </div>
      </section>

      <footer className="bg-secondary text-gray-300 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} SupportBot. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/admin" className="hover:text-white transition">Admin</Link>
            <a href="mailto:support@yourcompany.com" className="hover:text-white transition">support@yourcompany.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

