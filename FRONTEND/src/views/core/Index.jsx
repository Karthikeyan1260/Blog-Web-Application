import React, { useEffect, useState } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link } from "react-router-dom";

import apiInstance from "../../utils/axios";
import Toast from "../../plugin/Toast";
import Moment from "../../plugin/Moment";

function Index() {
    const [posts, setPosts] = useState([])
    const [category, setCategory] = useState([])

    const fetchPosts = async () => {
        try {
            const response_post = await apiInstance.get('post/lists/');
            const response_category = await apiInstance.get('post/category/list/');
            setPosts(response_post.data);
            setCategory(response_category.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);


    const itemsPerPage = 1;
    const [currentPage, setCurrentPage] = useState(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const postItems = posts?.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(posts?.length / itemsPerPage);
    const pageNumbers = Array.from({length: totalPages}, (_, index) => index + 1);


    return (
        <div>
            <Header />
            <section className="p-0">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <a href="#" className="d-block card-img-flash">
                                <img src="assets/images/adv-3.png" alt="" />
                            </a>
                            <h2 className="text-start d-block mt-1">Trending Articles 🔥</h2>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-4 pb-0">
                <div className="container">
                    <div className="row">
                        {postItems?.map((post, Index) => (
                            <div className="col-sm-6 col-lg-3" key={post?.id || Index}>
                                <div className="card mb-4">
                                    <div className="card-fold position-relative">
                                        <img className="card-img" style={{ width: "100%", height: "160px", objectFit: "cover" }} src={post.image} alt="Card" />
                                    </div>
                                    <div className="card-body px-3 pt-3">
                                        <h4 className="card-title">
                                            <Link to={`${post.slug}`} className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                                {post.title?.slice(0, 32) + "..."}
                                            </Link>
                                        </h4>
                                        <button style={{ border: "none", background: "none" }}>
                                            <i className="fas fa-bookmark text-danger"></i>
                                        </button>
                                        <button style={{ border: "none", background: "none" }}>
                                            <i className="fas fa-thumbs-up text-primary"></i>
                                        </button>

                                        <ul className="mt-3 list-style-none" style={{ listStyle: "none" }}>
                                            <li>
                                                <a href="#" className="text-dark text-decoration-none">
                                                    <i className="fas fa-user"></i> {post?.profile?.full_name || "SoulSociety"}
                                                </a>
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-calendar"></i> {Moment(post.date)}
                                            </li>
                                            <li className="mt-2">
                                                <i className="fas fa-eye"></i> {post.views} Views
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <nav className="d-flex mt-2">
                        <ul className="pagination">
                            <li key="prev" className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button className="page-link text-dark fw-bold me-1 rounded" onClick={() => setCurrentPage(currentPage - 1)}>
                                    <i className="fas fa-arrow-left me-2" />
                                    Previous
                                </button>
                            </li>
                        </ul>
                        <ul className="pagination">
                            {pageNumbers?.map((number) => (
                               <li key={number} className={`page-item ${currentPage === number ? "active text-white" : ""}`}>
                                   <button className="page-link text-dark fw-bold rounded" onClick={() => setCurrentPage(number)}>
                                        {number}
                                   </button>
                               </li>
                            ))}    
                        </ul>
                        <ul className="pagination">
                            <li key="next" className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button className="page-link text-dark fw-bold ms-1 rounded" onClick={() => setCurrentPage(currentPage + 1)}>
                                    Next
                                    <i className="fas fa-arrow-right ms-3 " />
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </section>

            <section className="bg-light pt-5 pb-5 mb-3 mt-3">
                <div className="container">
                    <div className="row g-0">
                        <div className="col-12 ">
                            <div className="mb-4">
                                <h2>Categories</h2>
                            </div>
                            <div className="d-flex flex-wrap justify-content-between">
                                {category?.map((c, Index) => (
                                    <div className="mt-2" key={c.slug || Index}>
                                            <div className="card bg-transparent">
                                                <img className="card-img" src= {c.image} style={{ width: "150px", height: "80px", objectFit: "cover" }} alt="card image" />
                                                <div className="d-flex flex-column align-items-center mt-3 pb-2">
                                                    <h5 className="mb-0">{c.title}</h5>
                                                    <small>{c.post_count || "0"}</small>
                                                </div>
                                            </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="p-0">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <a href="#" className="d-block card-img-flash">
                                <img src="assets/images/adv-3.png" alt="" />
                            </a>
                            <h2 className="text-start d-block mt-1">Latest Articles 🕒</h2>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-4 pb-0">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-6 col-lg-3">
                            <div className="card mb-4" >
                                <div className="card-fold position-relative">
                                    <img className="card-img" style={{ width: "100%", height: "160px", objectFit: "cover" }} src="https://awcdn1.ahmad.works/writing/wp-content/uploads/2015/05/cheerful-loving-couple-bakers-drinking-coffee-PCAVA6B-2.jpg" alt="Card image" />
                                </div>
                                <div className="card-body px-3 pt-3">
                                    <h4 className="card-title">
                                        <a href="post-single.html" className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                            7 common mistakes everyone makes while traveling
                                        </a>
                                    </h4>
                                    <ul className="mt-3 list-style-none" style={{ listStyle: "none" }}>
                                        <li>
                                            <a href="#" className="text-dark text-decoration-none">
                                                <i className="fas fa-user"></i> Louis Ferguson
                                            </a>
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-calendar"></i> Mar 07, 2022
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-eye"></i> 10 Views
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6 col-lg-3">
                            <div className="card mb-4">
                                <div className="card-fold position-relative">
                                    <img className="card-img" style={{ width: "100%", height: "160px", objectFit: "cover" }} src="https://awcdn1.ahmad.works/writing/wp-content/uploads/2015/05/yellow-and-gray-industrial-office-PFDQ5CR-1.jpg" alt="Card image" />
                                </div>
                                <div className="card-body px-3 pt-3">
                                    <h4 className="card-title">
                                        <a href="post-single.html" className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                            7 common mistakes everyone makes while traveling
                                        </a>
                                    </h4>
                                    <ul className="mt-3 list-style-none" style={{ listStyle: "none" }}>
                                        <li>
                                            <a href="#" className="text-dark text-decoration-none">
                                                <i className="fas fa-user"></i> Louis Ferguson
                                            </a>
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-calendar"></i> Mar 07, 2022
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-eye"></i> 10 Views
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6 col-lg-3">
                            <div className="card mb-4">
                                <div className="card-fold position-relative">
                                    <img className="card-img" style={{ width: "100%", height: "160px", objectFit: "cover" }} src="https://awcdn1.ahmad.works/writing/wp-content/uploads/2015/05/loft-office-with-vintage-decor-PFD2JSL-1.jpg" alt="Card image" />
                                </div>
                                <div className="card-body px-3 pt-3">
                                    <h4 className="card-title">
                                        <a href="post-single.html" className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                            7 common mistakes everyone makes while traveling
                                        </a>
                                    </h4>
                                    <ul className="mt-3 list-style-none" style={{ listStyle: "none" }}>
                                        <li>
                                            <a href="#" className="text-dark text-decoration-none">
                                                <i className="fas fa-user"></i> Louis Ferguson
                                            </a>
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-calendar"></i> Mar 07, 2022
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-eye"></i> 10 Views
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6 col-lg-3">
                            <div className="card mb-4">
                                <div className="card-fold position-relative">
                                    <img className="card-img" style={{ width: "100%", height: "160px", objectFit: "cover" }} src="https://awcdn1.ahmad.works/writing/wp-content/uploads/2015/05/glacier-ice-cave-of-iceland-PWYAVUU-1.jpg" alt="Card image" />
                                </div>
                                <div className="card-body px-3 pt-3">
                                    <h4 className="card-title">
                                        <a href="post-single.html" className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                            7 common mistakes everyone makes while traveling
                                        </a>
                                    </h4>
                                    <ul className="mt-3 list-style-none" style={{ listStyle: "none" }}>
                                        <li>
                                            <a href="#" className="text-dark text-decoration-none">
                                                <i className="fas fa-user"></i> Louis Ferguson
                                            </a>
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-calendar"></i> Mar 07, 2022
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-eye"></i> 10 Views
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6 col-lg-3">
                            <div className="card mb-4">
                                <div className="card-fold position-relative">
                                    <img className="card-img" style={{ width: "100%", height: "160px", objectFit: "cover" }} src="https://awcdn1.ahmad.works/writing/wp-content/uploads/2015/05/kitchen-and-dining-room-P5JHHM6.jpg" alt="Card image" />
                                </div>
                                <div className="card-body px-3 pt-3">
                                    <h4 className="card-title">
                                        <a href="post-single.html" className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                            7 common mistakes everyone makes while traveling
                                        </a>
                                    </h4>
                                    <ul className="mt-3 list-style-none" style={{ listStyle: "none" }}>
                                        <li>
                                            <a href="#" className="text-dark text-decoration-none">
                                                <i className="fas fa-user"></i> Louis Ferguson
                                            </a>
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-calendar"></i> Mar 07, 2022
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-eye"></i> 10 Views
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6 col-lg-3">
                            <div className="card mb-4">
                                <div className="card-fold position-relative">
                                    <img className="card-img" style={{ width: "100%", height: "160px", objectFit: "cover" }} src="https://awcdn1.ahmad.works/writing/wp-content/uploads/2015/05/black-woman-smiling-with-hands-in-hair-PMCFL93-1.jpg" alt="Card image" />
                                </div>
                                <div className="card-body px-3 pt-3">
                                    <h4 className="card-title">
                                        <a href="post-single.html" className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                            7 common mistakes everyone makes while traveling
                                        </a>
                                    </h4>
                                    <ul className="mt-3 list-style-none" style={{ listStyle: "none" }}>
                                        <li>
                                            <a href="#" className="text-dark text-decoration-none">
                                                <i className="fas fa-user"></i> Louis Ferguson
                                            </a>
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-calendar"></i> Mar 07, 2022
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-eye"></i> 10 Views
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6 col-lg-3">
                            <div className="card mb-4">
                                <div className="card-fold position-relative">
                                    <img className="card-img" style={{ width: "100%", height: "160px", objectFit: "cover" }} src="https://awcdn1.ahmad.works/writing/wp-content/uploads/2015/05/flat-with-touch-of-creativity-PX387LV-2.jpg" alt="Card image" />
                                </div>
                                <div className="card-body px-3 pt-3">
                                    <h4 className="card-title">
                                        <a href="post-single.html" className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                            7 common mistakes everyone makes while traveling
                                        </a>
                                    </h4>
                                    <ul className="mt-3 list-style-none" style={{ listStyle: "none" }}>
                                        <li>
                                            <a href="#" className="text-dark text-decoration-none">
                                                <i className="fas fa-user"></i> Louis Ferguson
                                            </a>
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-calendar"></i> Mar 07, 2022
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-eye"></i> 10 Views
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-6 col-lg-3">
                            <div className="card mb-4">
                                <div className="card-fold position-relative">
                                    <img className="card-img" style={{ width: "100%", height: "160px", objectFit: "cover" }} src="https://awcdn1.ahmad.works/writing/wp-content/uploads/2015/05/young-handsome-afro-black-man-going-upstairs-from-PJWPWPR-2.jpg" alt="Card image" />
                                </div>
                                <div className="card-body px-3 pt-3">
                                    <h4 className="card-title">
                                        <a href="post-single.html" className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                            7 common mistakes everyone makes while traveling
                                        </a>
                                    </h4>
                                    <ul className="mt-3 list-style-none" style={{ listStyle: "none" }}>
                                        <li>
                                            <a href="#" className="text-dark text-decoration-none">
                                                <i className="fas fa-user"></i> Louis Ferguson
                                            </a>
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-calendar"></i> Mar 07, 2022
                                        </li>
                                        <li className="mt-2">
                                            <i className="fas fa-eye"></i> 10 Views
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <nav className="d-flex mt-2">
                        <ul className="pagination">
                            <li className="">
                                <button className="page-link text-dark fw-bold me-1 rounded">
                                    <i className="fas fa-arrow-left me-2" />
                                    Previous
                                </button>
                            </li>
                        </ul>
                        <ul className="pagination">
                            <li key={1} className="active">
                                <button className="page-link text-dark fw-bold rounded">1</button>
                            </li>
                            <li key={2} className="ms-1">
                                <button className="page-link text-dark fw-bold rounded">2</button>
                            </li>
                        </ul>
                        <ul className="pagination">
                            <li className={`totalPages`}>
                                <button className="page-link text-dark fw-bold ms-1 rounded">
                                    Next
                                    <i className="fas fa-arrow-right ms-3 " />
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Index;