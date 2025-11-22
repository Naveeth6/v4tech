import { useEffect, useState } from "react";
import "App.css";
import { HashRouter, Navigate, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Textarea } from "components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "components/ui/card";
import { Label } from "components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { toast, Toaster } from "sonner";
import { Shield, Laptop, Globe, Star, Phone, Mail, MapPin, Menu, X, Search, AlertCircle, CheckCircle, Clock } from "lucide-react";
import Prism from "./components/Prism";
import Logo from "./logo/logo.png"
import MorphingText from "./components/MorphingText";
import AOS from "aos";
import "aos/dist/aos.css";
axios.defaults.withCredentials = true;




const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const AUTH_URL = "https://auth.emergentagent.com";

const Navigation = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-lg border-b border-[#2A2A2A]" style={{background:'Transparent'}} >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-20 h-20 bg-gradient-to-br  rounded-lg flex items-center justify-center">
              <img src={Logo} alt="logo" height="500px" width="500px" />
            </div>
            <span className="text-2xl font-bold text-white">V4 TECH</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-[#D4AF37]">Home</Link>
            <Link to="/about" className="text-gray-300 hover:text-[#D4AF37]">About</Link>
            <Link to="/services" className="text-gray-300 hover:text-[#D4AF37]">Services</Link>
            <Link to="/reviews" className="text-gray-300 hover:text-[#D4AF37]">Reviews</Link>
            <Link to="/support" className="text-gray-300 hover:text-[#D4AF37]">Support</Link>
            <Link to="/contact" className="text-gray-300 hover:text-[#D4AF37]">Contact</Link>
            {user ? (
              <>
                <Link to="/admin" className="text-gray-300 hover:text-[#D4AF37]">Admin</Link>
                <Button onClick={onLogout} variant="outline" size="sm" data-testid="logout-btn">Logout</Button>
              </>
            ) : (
              <Button onClick={() => navigate('/admin-login')} size="sm" data-testid="admin-login-btn">Admin Login</Button>
            )}
          </div>
          
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden" data-testid="mobile-menu-btn">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2" data-testid="mobile-menu"  >
            <Link to="/" className="block py-2 text-gray-300 hover:text-[#D4AF37]"  onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/about" className="block py-2 text-gray-300 hover:text-[#D4AF37]" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/services" className="block py-2 text-gray-300 hover:text-[#D4AF37]" onClick={() => setMobileMenuOpen(false)}>Services</Link>
            <Link to="/reviews" className="block py-2 text-gray-300 hover:text-[#D4AF37]" onClick={() => setMobileMenuOpen(false)}>Reviews</Link>
            <Link to="/support" className="block py-2 text-gray-300 hover:text-[#D4AF37]" onClick={() => setMobileMenuOpen(false)}>Support</Link>
            <Link to="/contact" className="block py-2 text-gray-300 hover:text-[#D4AF37]" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
            {user ? (
              <>
                <Link to="/admin" className="block py-2 text-gray-300 hover:text-[#D4AF37]" onClick={() => setMobileMenuOpen(false)}>Admin</Link>
                <Button onClick={onLogout} variant="outline" size="sm" className="w-full mt-2">Logout</Button>
              </>
            ) : (
              <Button onClick={() => navigate('/admin-login')} size="sm" className="w-full mt-2">Admin Login</Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API}/reviews`);
        setReviews(response.data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);
  
  return (
    <div className="min-h-screen"  data-testid="home-page">
      <section className="relative h-screen flex items-center justify-center overflow-hidden" >
        <div style={{ width: '100%',height:'100%' ,position:'absolute',backgroundColor:'black'}}>
  <Prism
    animationType="rotate"
    timeScale={0.5}
    height={3.5}
    baseWidth={5.5}
    scale={3.6}
    hueShift={0}
    colorFrequency={1}
    noise={0}
    glow={1}
  />
</div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-5xl font-bold text-white mb-6">
            <MorphingText />
          </h1>
          <p className="text-xl sm:text-xl text-white mb-12 max-w-3xl mx-auto">
            Your Trusted Tech Partner for CCTV, Laptops & Web Development
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 bg-[#D4AF37] text-black hover:bg-[#F4D03F]" onClick={() => navigate('/services')}  data-testid="explore-services-btn">
              Explore Services
            </Button>
            <Button size="lg" className="text-lg px-8 py-6 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF3720]" variant="outline" onClick={() => navigate('/contact')} data-testid="get-in-touch-btn">
              Get In Touch
            </Button>
          </div>
        </div>
      </section>
      
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4">Our Services</h2>
            <p className="text-lg text-gray-100">Professional tech solutions tailored to your needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:border-[#D4AF37] shadow-2xl transition-all duration-300  bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl" data-testid="service-card-cctv">
              <CardHeader>
                <div className="w-16 h-16 bg-[#D4AF3720] border border-[#D4AF37] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="text-white" size={32} />
                </div>
                <CardTitle className="text-2xl">CCTV Installation</CardTitle>
                <CardDescription className="text-base">Complete security camera setup and maintenance for homes and businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/services')} className="w-full" data-testid="cctv-learn-more">Learn More</Button>
              </CardContent>
            </Card>
            
            <Card className="group hover:border-[#D4AF37] shadow-2xl transition-all duration-300  bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl" data-testid="service-card-laptop">
              <CardHeader>
                <div className="w-16 h-16 bg-[#D4AF3720] border border-[#D4AF37] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Laptop className="text-white" size={32} />
                </div>
                <CardTitle className="text-2xl">Laptop Services</CardTitle>
                <CardDescription className="text-base">Expert repair, maintenance, and sales of quality laptops</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/services')} className="w-full" data-testid="laptop-learn-more">Learn More</Button>
              </CardContent>
            </Card>
            
            <Card className="group hover:border-[#D4AF37] shadow-2xl transition-all duration-300  bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl" data-testid="service-card-web">
              <CardHeader>
                <div className="w-16 h-16 bg-[#D4AF3720] border border-[#D4AF37] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="text-white" size={32} />
                </div>
                <CardTitle className="text-2xl">Web Development</CardTitle>
                <CardDescription className="text-base">Custom websites and web applications built with modern technology</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => navigate('/services')} className="w-full" data-testid="web-learn-more">Learn More</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {reviews.length > 0 && (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#0D0D0D]/90 backdrop-blur-lg border-b border-[#2A2A2A]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4">Client Reviews</h2>
              <p className="text-lg text-gray-300">What our customers say about us</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
              {reviews.map((review) => (
                <Card key={review.id} className="border-0 shadow-lgbg-[#1A1A1A] border border-[#D4AF37] rounded-xl" data-testid={`review-card-${review.id}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{review.customer_name}</CardTitle>
                      <div className="flex">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={16} fill="#FFA500" color="#FFA500" />
                        ))}
                      </div>
                    </div>
                    <CardDescription className="text-sm">{review.service_taken}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{review.review_text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" onClick={() => navigate('/reviews')} data-testid="view-all-reviews-btn">View All Reviews</Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    await axios.post(`${API}/auth/local-login`, 
      { username, password },
      { withCredentials: true }
    );
    
    toast.success("Login Successful!");
    navigate('/admin');  // <-- after this checkAuth() will run in Admin
  } catch (err) {
    toast.error('Invalid Credentials');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-[#1A1A1A] border border-[#D4AF37] rounded-xl hover: transition-all">
        <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const About = () => {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-[#0D0D0D]"  data-testid="about-page">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-100 mb-6" data-aos="fade-up">About V4 TECH</h1>
          <p className="text-xl text-gray-300" data-aos="fade-up" data-aos-delay="200">Your trusted technology partner for CCTV, Laptops & Web Development</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <img src="https://images.unsplash.com/photo-1712159018726-4564d92f3ec2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHx0ZWNoJTIwY29tcGFueSUyMG9mZmljZXxlbnwwfHx8fDE3NjMzMDE4NTB8MA&ixlib=rb-4.1.0&q=85" alt="V4 Tech Office" className="rounded-2xl shadow-2xl w-full h-96 object-cover"  data-aos="fade-right"/>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-100 mb-6"  data-aos="fade-right">Who We Are</h2>
            <p className="text-lg text-gray-300 mb-4" data-aos="fade-up" data-aos-delay="200">
              V4 TECH is a comprehensive technology solutions provider specializing in security systems, computer services, and digital presence development. We combine technical expertise with exceptional customer service to deliver solutions that matter.
            </p>
            <p className="text-lg text-gray-300" data-aos="fade-up" data-aos-delay="300">
              Our team of experienced professionals is dedicated to providing reliable, efficient, and innovative technology services to homes and businesses across the region.
            </p>
          </div>
        </div>
        
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-100 mb-8 text-center" data-aos="fade-up" data-aos-delay="100">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#D4AF3720] border border-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4" data-aos="fade-up" data-aos-delay="200">
                <CheckCircle className="text-white" size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-2" data-aos="fade-up" data-aos-delay="200">Quality Service</h3>
              <p className="text-gray-100" data-aos="fade-up" data-aos-delay="300">We never compromise on the quality of our work and materials</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#D4AF3720] border border-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4" data-aos="fade-up" data-aos-delay="200">
                <Shield className="text-white" size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-2" data-aos="fade-up" data-aos-delay="200">Trust & Reliability</h3>
              <p className="text-gray-100," data-aos="fade-up" data-aos-delay="300">Building long-term relationships through honest and dependable service</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-[#D4AF3720] border border-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-4" data-aos="fade-up" data-aos-delay="200">
                <Clock className="text-white" size={40}/>
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-2" data-aos="fade-up" data-aos-delay="200">Fast Support</h3>
              <p className="text-gray-100" data-aos="fade-up" data-aos-delay="200">Quick response times and efficient problem resolution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-[#0D0D0D]" data-testid="services-page">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-100 mb-6" data-aos="fade-up">Our Services</h1>
          <p className="text-xl text-gray-100" data-aos="fade-up" data-aos-delay="200">Comprehensive technology solutions for all your needs</p>
        </div>
        
        <div className="space-y-16 flex flex-col ">
          <div>
          <div className="border-0 shadow-2xl overflow-hidden" data-testid="cctv-service-detail">
            <div className="grid grid-cols-1 md:grid-cols-2" data-aos="fade-right">
              <img src="https://images.unsplash.com/photo-1566060475410-1159300f046f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxDQ1RWJTIwc2VjdXJpdHklMjBjYW1lcmF8ZW58MHx8fHwxNzYzMzAxODQ5fDA&ixlib=rb-4.1.0&q=85" alt="CCTV" className="w-full h-full object-cover" data-aos="fade-right" />
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="w-16 h-16 bg-[#D4AF3720] border border-[#D4AF37] rounded-xl flex items-center justify-center mb-6" data-aos="fade-right">
                  <Shield className="text-white" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-100 mb-4" data-aos="fade-right">CCTV Installation & Maintenance</h2>
                <p className="text-lg text-gray-200 mb-6" data-aos="fade-right" data-aos-delay="100">
                  Protect your property with our professional CCTV installation services. We offer:
                </p>
                <ul className="space-y-3 mb-8 text-gray-00">
                  <li className="flex items-start" data-aos="fade-up" data-aos-delay="100">
                    <CheckCircle className="text-yellow-400 mr-2 flex-shrink-0 mt-1" size={20} />
                    <span >HD and 4K camera systems</span>
                  </li>
                  <li className="flex items-start" data-aos="fade-up" data-aos-delay="200">
                    <CheckCircle className="text-yellow-400 mr-2 flex-shrink-0 mt-1" size={20} />
                    <span >Remote viewing and monitoring</span>
                  </li>
                  <li className="flex items-start" data-aos="fade-up" data-aos-delay="300">
                    <CheckCircle className="text-yellow-400 mr-2 flex-shrink-0 mt-1" size={20} />
                    <span >Night vision capabilities</span>
                  </li>
                  <li className="flex items-start" data-aos="fade-up" data-aos-delay="300">
                    <CheckCircle className="text-yellow-400 mr-2 flex-shrink-0 mt-1" size={20} />
                    <span >Professional installation and setup</span>
                  </li>
                  <li className="flex items-start" data-aos="fade-up" data-aos-delay="300">
                    <CheckCircle className="text-yellow-400 mr-2 flex-shrink-0 mt-1" size={20} />
                    <span>Regular maintenance and support</span>
                  </li>
                </ul>
                <Button size="lg" onClick={() => navigate('/book-service')} data-testid="book-cctv-btn" data-aos="zoom-in" data-aos-delay="300" className="text-base sm:text-lg leading-tight px-4 py-2 sm:px-8 sm:py-3 whitespace-normal break-words text-center">Book CCTV Service / Starting at Just ₹3999 🚀</Button>
              </div>
            </div>
          </div>

          <div className="border-0 shadow-2xl overflow-hidden" data-testid="laptop-service-detail">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 lg:p-12 flex flex-col justify-center order-2 md:order-1">
                <div className="w-16 h-16 bg-[#D4AF3720] border border-[#D4AF37] rounded-xl flex items-center justify-center mb-6" data-aos="fade-left">
                  <Laptop className="text-white" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-100 mb-4" data-aos="fade-left">Laptop Sales & Service</h2>
                <p className="text-lg text-gray-200 mb-6" data-aos="fade-left">
                  From repairs to new purchases, we've got all your laptop needs covered:
                </p>
                <ul className="space-y-3 mb-8 text-gray-300">
                  <li className="flex items-start"  data-aos="fade-up" data-aos-delay="100">
                    <CheckCircle className="text-yellow-400 mr-2 flex-shrink-0 mt-1" size={20} />
                    <span>Hardware repairs and upgrades</span>
                  </li>
                  <li className="flex items-start"  data-aos="fade-up" data-aos-delay="200">
                    <CheckCircle className="text-yellow-400 mr-2 flex-shrink-0 mt-1" size={20} />
                    <span>Software installation and troubleshooting</span>
                  </li>
                  <li className="flex items-start"  data-aos="fade-up" data-aos-delay="300">
                    <CheckCircle className="text-yellow-400 mr-2 flex-shrink-0 mt-1" size={20} />
                    <span>Data recovery services</span>
                  </li>
                  <li className="flex items-start"  data-aos="fade-up" data-aos-delay="400">
                    <CheckCircle className="text-yellow-400 mr-2 flex-shrink-0 mt-1" size={20} />
                    <span>New and refurbished laptop sales</span>
                  </li>
                  <li className="flex items-start"  data-aos="fade-up" data-aos-delay="500">
                    <CheckCircle className="text-yellow-400 mr-2 flex-shrink-0 mt-1" size={20} />
                    <span>Performance optimization</span>
                  </li>
                </ul>
                <Button size="lg" onClick={() => navigate('/book-service')} data-testid="book-laptop-btn" data-aos="zoom-in" data-aos-delay="500" className="text-base sm:text-lg leading-tight px-4 py-2 sm:px-8 sm:py-3 whitespace-normal break-words text-center">Book Laptop Service /  Starting at Just ₹999 🚀 </Button>
              </div>
              <img src="https://images.unsplash.com/photo-1606485940233-76eeff49360c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjByZXBhaXIlMjBzZXJ2aWNlfGVufDB8fHx8MTc2MzMwMTg1MHww&ixlib=rb-4.1.0&q=85" alt="Laptop Service" className="w-full h-full object-cover order-1 md:order-2" data-aos="fade-left" />
            </div>
          </div>

          <div className="border-0 shadow-2xl overflow-hidden" data-testid="web-service-detail">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <img src="https://images.unsplash.com/photo-1603985585179-3d71c35a537c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMHdvcmtzcGFjZXxlbnwwfHx8fDE3NjMyNzgxMjh8MA&ixlib=rb-4.1.0&q=85" alt="Web Development" className="w-full h-full object-cover"  data-aos="fade-left"/>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="w-16 h-16 bg-[#D4AF3720] border border-[#D4AF37] rounded-xl flex items-center justify-center mb-6"  data-aos="fade-left">
                  <Globe className="text-white" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-100 mb-4"  data-aos="fade-left">Website Development</h2>
                <p className="text-lg text-gray-200 mb-6"  data-aos="fade-left">
                  Establish your online presence with a professionally built website:
                </p>
                <ul className="space-y-3 mb-8 text-gray-300">
                  <li className="flex items-start" data-aos="fade-up" data-aos-delay="100">
                    <CheckCircle className="text-yellow-400 mr-2 flex-shrink-0 mt-1" size={20} />
                    <span>Custom website design and development</span>
                  </li>
                  <li className="flex items-start" data-aos="fade-up" data-aos-delay="200">
                    <CheckCircle className="text-yellow-400 mr-2 flex-shrink-0 mt-1" size={20} />
                    <span>E-commerce solutions</span>
                  </li>
                  <li className="flex items-start" data-aos="fade-up" data-aos-delay="300">
                    <CheckCircle className="text-yellow-400 mr-2 flex-shrink-0 mt-1" size={20} />
                    <span>Mobile-responsive design</span>
                  </li>
                  <li className="flex items-start" data-aos="fade-up" data-aos-delay="400">
                    <CheckCircle className="text-yellow-400 mr-2 flex-shrink-0 mt-1" size={20} />
                    <span>SEO optimization</span>
                  </li>
                  <li className="flex items-start" data-aos="fade-up" data-aos-delay="500">
                    <CheckCircle className="text-yellow-400 mr-2 flex-shrink-0 mt-1" size={20} />
                    <span>Ongoing maintenance and updates</span>
                  </li>
                </ul>
                <Button size="lg" onClick={() => navigate('/book-service')} data-testid="book-web-btn"  data-aos="zoom-in" data-aos-delay="500" className="text-base sm:text-xs leading-tight px-4 py-2 sm:px-5 sm:py-3 whitespace-normal break-words text-center">Book Web Development / Starting at Just ₹3499 🚀 </Button>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookService = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    service_needed: "",
    description: "",
    image_data: ""
  });
  const [submitting, setSubmitting] = useState(false);
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image_data: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await axios.post(`${API}/customer-details`, formData);
      toast.success("Submitted Successfully! Our team will contact you within 24 hours.", {
        duration: 5000,
        style: {
          background: '#10B981',
          color: '#fff',
          fontSize: '16px',
          padding: '16px 24px',
          borderRadius: '12px'
        }
      });
      setFormData({
        name: "",
        address: "",
        email: "",
        phone: "",
        service_needed: "",
        description: "",
        image_data: ""
      });
      setTimeout(() => navigate('/'), 2500);
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8" data-testid="book-service-page">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-100 mb-4">Book a Service</h1>
          <p className="text-lg text-gray-200">Fill out the form and we'll get back to you within 24 hours</p>
        </div>
        
        <Card className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-2xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  data-testid="book-name-input"
                />
              </div>
              
              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  data-testid="book-address-input"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    data-testid="book-email-input"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    data-testid="book-phone-input"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="service">Service Needed *</Label>
                <Select value={formData.service_needed} onValueChange={(value) => setFormData({ ...formData, service_needed: value })}>
                  <SelectTrigger data-testid="service-select">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-2xl" >
                    <SelectItem value="CCTV Installation">CCTV Installation</SelectItem>
                    <SelectItem value="CCTV Maintenance">CCTV Maintenance</SelectItem>
                    <SelectItem value="Laptop Repair">Laptop Repair</SelectItem>
                    <SelectItem value="Laptop Sales">Laptop Sales</SelectItem>
                    <SelectItem value="Website Development">Website Development</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Description of Issue/Requirements *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={5}
                  required
                  data-testid="book-description-input"
                />
              </div>
              
              <div>
                <Label htmlFor="image">Upload Image (Optional)</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  data-testid="book-image-input"
                />
              </div>
              
              <Button type="submit" size="lg" className="w-full" disabled={submitting} data-testid="submit-booking-btn">
                {submitting ? "Submitting..." : "Submit Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    service_taken: "",
    rating: 5,
    review_text: ""
  });
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    fetchReviews();
  }, []);
  
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await axios.post(`${API}/reviews`, formData);
      toast.success("Thank you for your review!.");
      setFormData({
        customer_name: "",
        email: "",
        service_taken: "",
        rating: 5,
        review_text: ""
      });
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8" data-testid="reviews-page">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-100 mb-4">Customer Reviews</h1>
          <p className="text-lg text-gray-200 mb-8">See what our clients have to say</p>
          <Button size="lg" onClick={() => setShowForm(!showForm)} data-testid="write-review-btn">
            {showForm ? "Cancel" : "Write a Review"}
          </Button>
        </div>
        
        {showForm && (
          <Card className="max-w-3xl mx-auto mb-12 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-2xl" data-testid="review-form">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="customer_name">Your Name *</Label>
                    <Input
                      id="customer_name"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      required
                      data-testid="review-name-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      data-testid="review-email-input"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="service_taken">Service Taken *</Label>
                  <Select value={formData.service_taken} onValueChange={(value) => setFormData({ ...formData, service_taken: value })}>
                    <SelectTrigger data-testid="review-service-select">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border border-[#2A2A2A]">
                      <SelectItem value="CCTV Installation">CCTV Installation</SelectItem>
                      <SelectItem value="Laptop Service">Laptop Service</SelectItem>
                      <SelectItem value="Website Development">Website Development</SelectItem>
                      <SelectItem value="Others Services">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Rating *</Label>
                  <div className="flex gap-2 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        data-testid={`rating-${star}`}
                      >
                        <Star
                          size={32}
                          fill={star <= formData.rating ? "#FFA500" : "none"}
                          color={star <= formData.rating ? "#FFA500" : "#gray"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="review_text">Your Review *</Label>
                  <Textarea
                    id="review_text"
                    value={formData.review_text}
                    onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                    rows={5}
                    required
                    data-testid="review-text-input"
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full" disabled={submitting} data-testid="submit-review-btn">
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <Card key={review.id} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-lg" data-testid={`review-card-${review.id}`}>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle>{review.customer_name}</CardTitle>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#FFA500" color="#FFA500" />
                    ))}
                  </div>
                </div>
                <CardDescription>{review.service_taken}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{review.review_text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {reviews.length === 0 && !showForm && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Support = () => {
  const [activeTab, setActiveTab] = useState("submit");
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    phone: "",
    subject: "",
    description: ""
  });
  const [searchId, setSearchId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searching, setSearching] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await axios.post(`${API}/complaints`, formData);
      toast.success(`Submitted Successfully! Our team will contact you within 24 hours. Your Complaint ID is: ${response.data.complaint_id}`, {
        duration: 6000,
        style: {
          background: '#10B981',
          color: '#fff',
          fontSize: '16px',
          padding: '16px 24px',
          borderRadius: '12px'
        }
      });
      setFormData({
        customer_name: "",
        email: "",
        phone: "",
        subject: "",
        description: ""
      });
      setActiveTab("check");
      setSearchId(response.data.complaint_id);
    } catch (error) {
      toast.error("Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setComplaint(null);
    
    try {
      const response = await axios.get(`${API}/complaints/search/${searchId}`);
      setComplaint(response.data);
    } catch (error) {
      toast.error("Complaint not found. Please check your Complaint ID or Phone Number.");
    } finally {
      setSearching(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "text-yellow-600 bg-yellow-50";
      case "In Progress": return "text-blue-600 bg-blue-50";
      case "Completed": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };
  
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8" data-testid="support-page">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-100 mb-4">Customer Support</h1>
          <p className="text-lg text-gray-200">Submit a complaint or check your complaint status</p>
        </div>
        
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={activeTab === "submit" ? "default" : "outline"}
            onClick={() => setActiveTab("submit")}
            data-testid="submit-tab-btn"
          >
            Submit Complaint
          </Button>
          <Button
            variant={activeTab === "check" ? "default" : "outline"}
            onClick={() => setActiveTab("check")}
            data-testid="check-tab-btn"
          >
            Check Status
          </Button>
        </div>
        
        {activeTab === "submit" && (
          <Card className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-2xl" data-testid="complaint-form">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="customer_name">Full Name *</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    required
                    data-testid="complaint-name-input"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      data-testid="complaint-email-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      data-testid="complaint-phone-input"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    data-testid="complaint-subject-input"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    required
                    data-testid="complaint-description-input"
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full" disabled={submitting} data-testid="submit-complaint-btn">
                  {submitting ? "Submitting..." : "Submit Complaint"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
        
        {activeTab === "check" && (
          <div className="space-y-8">
            <Card className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleSearch} className="space-y-6">
                  <div>
                    <Label htmlFor="searchId">Enter Phone Number or Complaint ID</Label>
                    <Input
                      id="searchId"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      placeholder="e.g., 9876543210"
                      required
                      data-testid="search-complaint-input"
                    />
                    <p className="text-sm text-gray-200 mt-1">You can search using Phone Number or Complaint ID</p>
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full" disabled={searching} data-testid="search-complaint-btn">
                    {searching ? "Searching..." : "Check Status"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {complaint && (
              <Card className=" bg-[#1A1A1A] border border-[#2A2A2A] border-0 shadow-2xl" data-testid="complaint-details">
                <CardHeader>
                  <CardTitle className="text-2xl">Complaint Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-white">Complaint ID</p>
                    <p className="text-lg font-semibold">{complaint.complaint_id}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-white">Status</p>
                    <span className={`inline-block px-4 py-2 rounded-full font-semibold ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-white">Subject</p>
                    <p className="text-lg">{complaint.subject}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-white">Description</p>
                    <p className="text-gray-300">{complaint.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-white">Submitted</p>
                      <p className="text-gray-300">{new Date(complaint.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white">Last Updated</p>
                      <p className="text-gray-300">{new Date(complaint.updated_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await axios.post(`${API}/contact`, formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8" data-testid="contact-page">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-100 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-200">Get in touch with our team</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Card className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-2xl mb-8">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      data-testid="contact-name-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      data-testid="contact-email-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      required
                      data-testid="contact-message-input"
                    />
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full" disabled={submitting} data-testid="send-message-btn">
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#D4AF3720] border border-[#D4AF37] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Phone</h3>
                  <p className="text-gray-300">+91 90253 38807</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#D4AF3720] border border-[#D4AF37] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Email</h3>
                  <p className="text-gray-300">vasanv4tech@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#D4AF3720] border border-[#D4AF37] rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Address</h3>
                  <p className="text-gray-300">  Neay by Thearady ,Kilaveethi ,Natchiyar Kovil<br/>Kumbakonam, Tamil Nadu 612602</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <Card className="border-0 shadow-2xl overflow-hidden h-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d15670.619502015286!2d79.4424576532009!3d10.913811957807836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTDCsDU0JzU4LjciTiA3OcKwMjYnNTAuNSJF!5e0!3m2!1sen!2sin!4v1763662213049!5m2!1sen!2sin" 
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "500px" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="V4 Tech Location"
              ></iframe>
            </Card>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button
            size="lg"
            onClick={() => window.open('https://wa.me/919025338807', '_blank')}
            className="bg-green-600 hover:bg-green-700"
            data-testid="whatsapp-btn"
          >
            Chat on WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [customerDetails, setCustomerDetails] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [messages, setMessages] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  
  useEffect(() => {
    checkAuth();
  }, []);
  
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('session_id=')) {
      const sessionId = hash.split('session_id=')[1].split('&')[0];
      processSession(sessionId);
    }
  }, [location]);
  
  const processSession = async (sessionId) => {
    try {
      await axios.post(`${API}/auth/session`, null, {
        params: { session_id: sessionId },
        withCredentials: true
      });
      window.location.hash = '';
      window.location.reload();
    } catch (error) {
      toast.error("Authentication failed");
      navigate('/');
    }
  };
  
  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, { withCredentials: true });
      setUser(response.data);
      fetchAllData();
    } catch (error) {
      navigate('/');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAllData = async () => {
    try {
      const [statsRes, detailsRes, reviewsRes, complaintsRes, messagesRes] = await Promise.all([
        axios.get(`${API}/stats`, { withCredentials: true }),
        axios.get(`${API}/customer-details`, { withCredentials: true }),
        axios.get(`${API}/reviews?approved_only=false`, { withCredentials: true }),
        axios.get(`${API}/complaints`, { withCredentials: true }),
        axios.get(`${API}/contact`, { withCredentials: true })
      ]);
      
      setStats(statsRes.data);
      setCustomerDetails(detailsRes.data);
      setReviews(reviewsRes.data);
      setComplaints(complaintsRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      toast.error("Failed to load data");
    }
  };
  
  const handleApproveReview = async (reviewId) => {
    try {
      await axios.patch(`${API}/reviews/${reviewId}/approve`, null, { withCredentials: true });
      toast.success("Review approved");
      fetchAllData();
    } catch (error) {
      toast.error("Failed to approve review");
    }
  };
  
  const handleDeleteReview = async (reviewId) => {
    try {
      await axios.delete(`${API}/reviews/${reviewId}`, { withCredentials: true });
      toast.success("Review deleted");
      fetchAllData();
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };
  
  const handleUpdateComplaintStatus = async (complaintId, status) => {
    try {
      await axios.patch(`${API}/complaints/${complaintId}/status`, { status }, { withCredentials: true });
      toast.success("Status updated");
      fetchAllData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };
  
  const handleUpdateCustomerStatus = async (detailId, status) => {
    try {
      await axios.patch(`${API}/customer-details/${detailId}/status`, null, {
        params: { status },
        withCredentials: true
      });
      toast.success("Status updated");
      fetchAllData();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };
  
  const handleDeleteCustomer = async (detailId) => {
    if (!window.confirm("Are you sure you want to delete this customer request?")) return;
    
    try {
      await axios.delete(`${API}/customer-details/${detailId}`, { withCredentials: true });
      toast.success("Customer request deleted");
      fetchAllData();
    } catch (error) {
      toast.error("Failed to delete customer request");
    }
  };
  
  const handleUpdateCustomer = async (detailId, data) => {
    try {
      await axios.patch(`${API}/customer-details/${detailId}`, data, { withCredentials: true });
      toast.success("Customer details updated");
      setEditingCustomer(null);
      fetchAllData();
    } catch (error) {
      toast.error("Failed to update customer details");
    }
  };
  
  const handleDeleteComplaint = async (complaintId) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    
    try {
      await axios.delete(`${API}/complaints/${complaintId}`, { withCredentials: true });
      toast.success("Complaint deleted");
      fetchAllData();
    } catch (error) {
      toast.error("Failed to delete complaint");
    }
  };
  
  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    
    try {
      await axios.delete(`${API}/contact/${messageId}`, { withCredentials: true });
      toast.success("Message deleted");
      fetchAllData();
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };
  
  const handleUpdateReview = async (reviewId, data) => {
    try {
      await axios.patch(`${API}/reviews/${reviewId}`, data, { withCredentials: true });
      toast.success("Review updated");
      setEditingReview(null);
      fetchAllData();
    } catch (error) {
      toast.error("Failed to update review");
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="admin-loading">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8" data-testid="admin-page">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">Welcome back, {user?.name}</p>
        </div>
        
        <div className="flex gap-4 mb-8 overflow-x-auto">
          <Button variant={activeTab === "dashboard" ? "default" : "outline"} onClick={() => setActiveTab("dashboard")} data-testid="dashboard-tab">Dashboard</Button>
          <Button variant={activeTab === "customers" ? "default" : "outline"} onClick={() => setActiveTab("customers")} data-testid="customers-tab">Customer Requests</Button>
          <Button variant={activeTab === "reviews" ? "default" : "outline"} onClick={() => setActiveTab("reviews")} data-testid="reviews-tab">Reviews</Button>
          <Button variant={activeTab === "complaints" ? "default" : "outline"} onClick={() => setActiveTab("complaints")} data-testid="complaints-tab">Complaints</Button>
          <Button variant={activeTab === "messages" ? "default" : "outline"} onClick={() => setActiveTab("messages")} data-testid="messages-tab">Messages</Button>
        </div>
        
        {activeTab === "dashboard" && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="stats-section">
            <Card className="bg-[#1A1A1A] border border-[#2A2A2A] shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm text-white">Total Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl text-[#D4AF37] font-bold">{stats.total_customers}</p>
                <p className="text-sm text-gray-300 mt-1">{stats.pending_customers} pending</p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1A1A1A] border border-[#2A2A2A] shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm text-white">Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl text-[#D4AF37] font-bold">{stats.total_reviews}</p>
                <p className="text-sm text-gray-300 mt-1">{stats.pending_reviews} pending approval</p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1A1A1A] border border-[#2A2A2A] shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm text-white">Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl text-[#D4AF37] font-bold">{stats.total_complaints}</p>
                <p className="text-sm text-gray-300 mt-1">{stats.pending_complaints} pending</p>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1A1A1A] border border-[#2A2A2A] shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm text-white">Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl text-[#D4AF37] font-bold">{stats.total_messages}</p>
              </CardContent>
            </Card>
          </div>
        )}
        
        {activeTab === "customers" && (
          <div className="space-y-4" data-testid="customers-section">
            {customerDetails.map((detail) => (
              <Card key={detail.id} className="bg-[#1A1A1A] border border-[#2A2A2A] shadow-lg">
                <CardContent className="p-6">
                  {editingCustomer?.id === detail.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={editingCustomer.name}
                            onChange={(e) => setEditingCustomer({...editingCustomer, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            value={editingCustomer.email}
                            onChange={(e) => setEditingCustomer({...editingCustomer, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input
                            value={editingCustomer.phone}
                            onChange={(e) => setEditingCustomer({...editingCustomer, phone: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Service Needed</Label>
                          <Input
                            value={editingCustomer.service_needed}
                            onChange={(e) => setEditingCustomer({...editingCustomer, service_needed: e.target.value})}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Address</Label>
                          <Textarea
                            value={editingCustomer.address}
                            onChange={(e) => setEditingCustomer({...editingCustomer, address: e.target.value})}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Description</Label>
                          <Textarea
                            value={editingCustomer.description}
                            onChange={(e) => setEditingCustomer({...editingCustomer, description: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleUpdateCustomer(detail.id, editingCustomer)}>Save</Button>
                        <Button variant="outline" onClick={() => setEditingCustomer(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-white">Name</p>
                          <p className="font-semibold">{detail.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white">Email</p>
                          <p>{detail.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white">Phone</p>
                          <p>{detail.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white">Service</p>
                          <p>{detail.service_needed}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-white">Address</p>
                          <p>{detail.address}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-white">Description</p>
                          <p>{detail.description}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white mb-2">Status</p>
                          <Select value={detail.status} onValueChange={(value) => handleUpdateCustomerStatus(detail.id, value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className='bg-[#1A1A1A] border border-[#2A2A2A] shadow-lg'>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" onClick={() => setEditingCustomer(detail)} data-testid={`edit-customer-${detail.id}`}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteCustomer(detail.id)} data-testid={`delete-customer-${detail.id}`}>
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
            {customerDetails.length === 0 && (
              <p className="text-center text-white py-8">No customer requests yet</p>
            )}
          </div>
        )}
        
        {activeTab === "reviews" && (
          <div className="space-y-4" data-testid="reviews-section">
            {reviews.map((review) => (
              <Card key={review.id} className="bg-[#1A1A1A] border border-[#2A2A2A] shadow-lg">
                <CardContent className="p-6">
                  {editingReview?.id === review.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Customer Name</Label>
                          <Input
                            value={editingReview.customer_name}
                            onChange={(e) => setEditingReview({...editingReview, customer_name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            value={editingReview.email}
                            onChange={(e) => setEditingReview({...editingReview, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Service Taken</Label>
                          <Input
                            value={editingReview.service_taken}
                            onChange={(e) => setEditingReview({...editingReview, service_taken: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Rating</Label>
                          <div className="flex gap-2 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setEditingReview({...editingReview, rating: star})}
                              >
                                <Star
                                  size={24}
                                  fill={star <= editingReview.rating ? "#FFA500" : "none"}
                                  color={star <= editingReview.rating ? "#FFA500" : "#gray"}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <Label>Review Text</Label>
                          <Textarea
                            value={editingReview.review_text}
                            onChange={(e) => setEditingReview({...editingReview, review_text: e.target.value})}
                            rows={4}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleUpdateReview(review.id, editingReview)}>Save</Button>
                        <Button variant="outline" onClick={() => setEditingReview(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-semibold text-lg">{review.customer_name}</p>
                          <p className="text-sm text-white">{review.email}</p>
                          <p className="text-sm text-white">{review.service_taken}</p>
                        </div>
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} size={16} fill="#FFA500" color="#FFA500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-white mb-4">{review.review_text}</p>
                      <div className="flex gap-2 flex-wrap">
                        {!review.approved && (
                          <Button onClick={() => handleApproveReview(review.id)} size="sm" data-testid={`approve-review-${review.id}`}>Approve</Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => setEditingReview(review)} data-testid={`edit-review-${review.id}`}>
                          Edit
                        </Button>
                        <Button onClick={() => handleDeleteReview(review.id)} variant="destructive" size="sm" data-testid={`delete-review-${review.id}`}>Delete</Button>
                        {review.approved && <span className="text-green-600 text-sm flex items-center"><CheckCircle size={16} className="mr-1" /> Approved</span>}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
            {reviews.length === 0 && (
              <p className="text-center text-White py-8">No reviews yet</p>
            )}
          </div>
        )}
        
        {activeTab === "complaints" && (
          <div className="space-y-4" data-testid="complaints-section">
            {complaints.map((complaint) => (
              <Card key={complaint.id} className="bg-[#1A1A1A] border border-[#2A2A2A] shadow-lg">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-white">Complaint ID</p>
                      <p className="font-semibold">{complaint.complaint_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white">Customer</p>
                      <p>{complaint.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white">Email</p>
                      <p>{complaint.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white">Phone</p>
                      <p>{complaint.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-white">Subject</p>
                      <p className="font-semibold">{complaint.subject}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-white">Description</p>
                      <p>{complaint.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white mb-2">Status</p>
                      <Select value={complaint.status} onValueChange={(value) => handleUpdateComplaintStatus(complaint.complaint_id, value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className='bg-[#1A1A1A] border border-[#2A2A2A] shadow-lg'>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <p className="text-sm text-white">Submitted</p>
                      <p>{new Date(complaint.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteComplaint(complaint.complaint_id)} data-testid={`delete-complaint-${complaint.id}`}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {complaints.length === 0 && (
              <p className="text-center text-white py-8">No complaints yet</p>
            )}
          </div>
        )}
        
        {activeTab === "messages" && (
          <div className="space-y-4" data-testid="messages-section">
            {messages.map((message) => (
              <Card key={message.id} className="bg-[#1A1A1A] border border-[#2A2A2A] shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <p className="font-semibold text-lg">{message.name}</p>
                    <p className="text-sm text-white">{message.email}</p>
                  </div>
                  <p className="text-gray-300">{message.message}</p>
                  <p className="text-sm text-gray-300 mt-4">{new Date(message.created_at).toLocaleString()}</p>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteMessage(message.id)} data-testid={`delete-message-${message.id}`}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {messages.length === 0 && (
              <p className="text-center text-white py-8">No messages yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/*footer*/

const Footer = () => {
    return (
      <footer className="bg-[#0D0D0D] text-gray-200">
<div className="max-w-7xl mx-auto px-6 py-14">
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">


{/* Brand */}
<div className="space-y-4">
  <div className="flex gap-4">
  <img src={Logo} alt="V4 TECH Logo" className="h-10 w-auto" />
<h2 className="text-2xl font-bold text-white">V4 TECH</h2>
</div>
<p className="text-gray-300 text-sm">Secure, Repair & Build — Your trusted tech partner for CCTV, Laptop & Web Development.</p>


<div className="text-sm text-gray-300 space-y-2">
<p><span className="font-semibold">Phone:</span> +91 90253 38807</p>
<p className="break-all"><span className="font-semibold">Email:</span> vasanv4tech@gmail.com</p>
<p><span className="font-semibold">Address:</span> Neay by Thearady, Kilaveethi, Natchiyar Kovil, Kumbakonam, Tamil Nadu 612602</p>
</div>
</div>


{/* Quick Links */}
<div>
<h4 className="text-lg font-semibold mb-4">Quick Links</h4>
<ul className="space-y-2 text-sm text-gray-300">
<li><a href="/" className="hover:text-#e6b926">Home</a></li>
<li><a href="/about" className="hover:text-#e6b926">About</a></li>
<li><a href="/services" className="hover:text-#e6b926">Services</a></li>
<li><a href="/reviews" className="hover:text-#e6b926">Reviews</a></li>
<li><a href="/support" className="hover:text-#e6b926">Support</a></li>
<li><a href="/contact" className="hover:text-#e6b926">Contact</a></li>
</ul>
</div>


{/* Our Services */}
<div>
<h4 className="text-lg font-semibold mb-4">Our Services</h4>
<ul className="space-y-2 text-sm text-gray-300">
<li><a href="/services#cctv" className="hover:text-#e6b926">CCTV Installation</a></li>
<li><a href="/services#laptop" className="hover:text-#e6b926">Laptop Services</a></li>
<li><a href="/services#web" className="hover:text-#e6b926">Web Development</a></li>
</ul>
</div>


{/* Social / WhatsApp */}
<div>
<h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
<p className="text-sm text-gray-400">For fast support, contact us on WhatsApp.</p>


<a href="https://wa.me/919025338807" className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-md text-sm font-medium">
Chat on WhatsApp
</a>
</div>
</div>


{/* Bottom */}
<div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-300 gap-4">
<p>© {new Date().getFullYear()} V4 TECH. All Rights Reserved.</p>
<div>
<p>Designed & Developed by V4 TECH</p>
</div>
</div>
</div>
</footer>
    )

  }

function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    checkAuth();
  }, []);
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);
  
  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, { withCredentials: true });
      setUser(response.data);
    } catch (error) {
      // Not authenticated
    }
  };
  
  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, null, { withCredentials: true });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const ProtectedRoute = ({ children }) => {
  if (user === null) {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

  
  return (
    <HashRouter>
      <Toaster />
      <Navigation user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/book-service" element={<BookService />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/support" element={<Support />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </HashRouter>
  );
}

export default App;




                                                                              /*Developed by: B Mohamed Naveeth */
