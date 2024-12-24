import React from 'react'

const Footer = () => {
    return (
        <>
            <div className="bg-gray-900 text-white py-10">
                <div className="container mx-auto px-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {/* Footer Section 1 */}
                        <div className="ft-1">
                            <h3 className="text-3xl font-bold mb-4"><span className="text-teal-400">bid</span>spirit</h3>
                            <p className="mb-6">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum ea quo ex ullam laboriosam magni totam, facere eos iure voluptate.</p>
                            <div className="flex space-x-4">
                                <a href="#" className="hover:text-teal-400">
                                    <i className="fab fa-facebook fa-2x"></i>
                                </a>
                                <a href="#" className="hover:text-teal-400">
                                    <i className="fab fa-twitter fa-2x"></i>
                                </a>
                                <a href="#" className="hover:text-teal-400">
                                    <i className="fab fa-instagram fa-2x"></i>
                                </a>
                                <a href="#" className="hover:text-teal-400">
                                    <i className="fab fa-linkedin-in fa-2x"></i>
                                </a>
                            </div>
                        </div>
                        {/* Footer Section 2 */}
                        <div className="ft-2">
                            <h5 className="text-xl font-semibold mb-4">Quick Links</h5>
                            <ul className="space-y-3">
                                <li>
                                    <a className="hover:text-teal-400" href="/">Home</a>
                                </li>
                                <li>
                                    <a className="hover:text-teal-400" href="/how-it-works-info">How it Works</a>
                                </li>
                                <li>
                                    <a className="hover:text-teal-400" href="/contact">Contact Us</a>
                                </li>
                                <li>
                                    <a className="hover:text-teal-400" href="/about">About Us</a>
                                </li>
                                
                            </ul>
                        </div>
                        {/* Footer Section 3 */}
                        <div className="ft-3">
                            <h5 className="text-xl font-semibold mb-4">Contact Us</h5>
                            <p className="mb-3 flex items-center">
                                <i className="fas fa-phone-volume mr-2"></i> +92 3121324083
                            </p>
                            <p className="mb-3 flex items-center">
                                <i className="fas fa-envelope mr-2"></i> waleedishfaq1515@gmail.com
                            </p>
                            <p className="mb-3 flex items-center">
                                <i className="fas fa-paper-plane mr-2"></i> Abbottabad, Pakistan
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-800 py-3">
                <p className="text-center text-gray-400">Design By T.M. Threemavithana</p>
            </div>
        </>
    )
}

export default Footer;
