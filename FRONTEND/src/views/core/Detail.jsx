import React, { useState, useEffect } from "react";
import Header from "../partials/Header";
import Footer from "../partials/Footer";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";

import apiInstance from "../../utils/axios";
import moment from "moment";
import Toast from "../../plugin/Toast";

function Detail() {
    const [post, setPost] = useState([]);
    const [tags, setTags] = useState([]);
    const [createComment, setCreateComment] = useState({ full_name: "", email: "", comment: "" });
    const [readingTime, setReadingTime] = useState(0);
    const [isReading, setIsReading] = useState(false);

    const param = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const fetchPost = async () => {
        const response = await apiInstance.get(`post/detail/${param.slug}/`);
        setPost(response.data);

        const tagArray = response.data?.tags?.split(",");
        setTags(tagArray);
    };

    useEffect(() => {
        fetchPost();
    }, []);

    useEffect(() => {
        const savedReadingTime = localStorage.getItem('readingTime');
        if (savedReadingTime) {
            setReadingTime(Number(savedReadingTime));
        }
    }, []);

    useEffect(() => {
        const handleBeforeUnload = () => {
            console.log('Saving reading time:', readingTime);
            localStorage.setItem('readingTime', readingTime);
            // Set isReading to false when the user is about to leave the page
            setIsReading(false);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        let timer;

        if (isReading) {
            timer = setInterval(() => {
                setReadingTime(prevTime => {
                    console.log("Reading Time Updated:", prevTime + 1);
                    return prevTime + 1;
                });
            }, 1000); // Update every second
        }

        return () => {
            clearInterval(timer);
        };
    }, [isReading]);

    useEffect(() => {
        setIsReading(true);
    
        return () => {
            setIsReading(false);
        };
    }, [location]);

    const handleCreateCommentChange = (event) => {
        setCreateComment({
            ...createComment,
            [event.target.name]: event.target.value,
        });
    };

    const handleCreateCommentSubmit = async (e) => {
        e.preventDefault();

        console.log(post.id);
        console.log(createComment.full_name);
        console.log(createComment.email);
        console.log(createComment.comment);

        const jsonData = {
            post_id: post?.id,
            name: createComment.full_name,
            email: createComment.email,
            comment: createComment.comment,
        };

        const response = await apiInstance.post(`post/comment-post/`, jsonData);
        console.log(response);
        fetchPost();
        Toast("success", "Comment Posted.", "");
        setCreateComment({
            full_name: "",
            email: "",
            comment: "",
        });
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        return `${minutes} Mins Read`;
    };

    const handleLikePost = async () => {
        const json = {
            user_id: 1,
            post_id: post?.id,
        };

        const response = await apiInstance.post(`post/like-post/`, json)
        console.log(response.data);
        Toast("success", response.data.message);
        fetchPost();
    };

    const handleBookmarkPost = async () => {
        const json = {
            user_id: 1,
            post_id: post?.id,
        };

        const response = await apiInstance.post(`post/bookmark-post/`, json);
        console.log(response.data);
        Toast("success", response.data.message);
        fetchPost();
    }
    return (
        <>
            <Header />
            <section className=" mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <a href="#" className="badge bg-danger mb-2 text-decoration-none">
                                <i className="small fw-bold " />
                                {post.category?.title}
                            </a>
                            <h1 className="text-center">{post.title}</h1>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-0">
                <div className="container position-relative" data-sticky-container="">
                    <div className="row">
                        <div className="col-lg-2">
                            <div className="text-start text-lg-center mb-5" data-sticky="" data-margin-top={80} data-sticky-for={991}>
                                <div className="position-relative">
                                    <div className="avatar avatar-xl">
                                        <img className="avatar-img" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }} src={post.profile?.image} alt="avatar" />
                                    </div>
                                    <a href="#" className="h5 fw-bold text-dark text-decoration-none mt-2 mb-0 d-block">
                                        {post.profile?.full_name}
                                    </a>
                                    <p>{post.profile?.bio}</p>
                                </div>

                                <hr className="d-none d-lg-block " />

                                <ul className="list-inline list-unstyled">
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <i className="fas fa-calendar"></i> {moment(post.date).format("DD MMM, YYYY")}
                                    </li>
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <i className="fas fa-clock"></i> {formatTime(readingTime)}
                                    </li>
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <a href="#" className="text-body">
                                            <i className="fas fa-heart me-1" />
                                        </a>
                                        {post?.likes?.length} Likes
                                    </li>
                                    <li className="list-inline-item d-lg-block my-lg-2 text-start">
                                        <i className="fas fa-eye" />
                                        {post.views} Views
                                    </li>
                                </ul>
                                {/* Tags */}
                                <ul className="list-inline text-primary-hover mt-0 mt-lg-3 text-start">
                                    {tags?.map((tag, Index) => (
                                        <li className="list-inline-item" key={Index}>
                                            <a className="text-body text-decoration-none fw-bold" href="#">
                                                #{tag}
                                            </a>
                                        </li>
                                    ))} 
                                </ul>

                                
                                <button onClick={handleLikePost} className="btn btn-primary">
                                    <i className="fas fa-thumbs-up me-2"></i>
                                    {post?.likes?.length}
                                </button>
                                <button onClick={handleBookmarkPost} className="btn btn-danger ms-2">
                                    <i className="fas fa-bookmark"></i>
                                </button>

                            </div>
                        </div>
                        {/* Left sidebar END */}
                        {/* Main Content START */}
                        <div className="col-lg-10 mb-5">
                            <p>
                                {post.description}
                            </p>
                           
                            {/* <div className="mt-5">
                                <h2 className="my-3">
                                    <i className="bi bi-symmetry-vertical me-2" />
                                    Related post
                                </h2>
                                <section className="pt-4 pb-0">
                                    <div className="container">
                                        <div className="row">
                                            <div className="col-sm-6 col-lg-3">
                                                <div className="card mb-4">
                                                    <div className="card-fold position-relative">
                                                        <img className="card-img" style={{ width: "100%", height: "160px", objectFit: "cover" }} src="https://awcdn1.ahmad.works/writing/wp-content/uploads/2015/05/kitchen-and-dining-room-P5JHHM6.jpg" alt="Card image" />
                                                    </div>
                                                    <div className="card-body px-3 pt-3">
                                                        <h4 className="card-title">
                                                            <Link to={`/7-common-mistakes-everyone-makes-while-travelling/`} className="btn-link text-reset stretched-link fw-bold text-decoration-none">
                                                                7 common mistakes everyone makes while traveling
                                                            </Link>
                                                        </h4>
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
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div> */}

                            <hr />
                            {/* { <div className="d-flex py-4">
                                <a href="#">
                                    <div className="avatar avatar-xxl me-4">
                                        <img className="avatar-img rounded-circle" src="https://awcdn1.ahmad.works/writing/wp-content/uploads/2015/05/Author.jpg" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%" }} alt="avatar" />
                                    </div>
                                </a>
                                <div>
                                    <div className="d-sm-flex align-items-center justify-content-between">
                                        <div>
                                            <h4 className="m-0">
                                                <a href="#" className="text-dark text-decoration-none">
                                                    Louis Ferguson
                                                </a>
                                            </h4>
                                            <small>Writer at Soul</small>
                                        </div>
                                    </div>
                                    <p className="my-2">Louis Ferguson is a senior editor for the blogzine and also reports on breaking news based in London. He has written about government, criminal justice, and the role of money in politics since 2015.</p>
                                    { Social icons }
                                    <ul className="nav">
                                        <li className="nav-item">
                                            <a className="nav-link ps-0 pe-2 fs-5" href="#">
                                                <i className="fab fa-facebook-square" />
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link px-2 fs-5" href="#">
                                                <i className="fab fa-twitter-square" />
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a className="nav-link px-2 fs-5" href="#">
                                                <i className="fab fa-linkedin" />
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div> } */}

                            <div>
                                <h3>{post.comments?.length} comments</h3>
                                {post.comments?.map((c, Index) => (
                                    <div className="my-4 d-flex bg-light p-3 mb-3 rounded" key={Index}>
                                        <img
                                            className="avatar avatar-md rounded-circle float-start me-3"
                                            src={post.profile?.image}
                                            style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "50%" }}
                                            alt="avatar"
                                        />
                                        <div>
                                            <div className="mb-2">
                                                <h5 className="m-0">{c?.name}</h5>
                                                <span className="me-3 small">{moment(c.date).format("DD MMM, YYYY")}</span>
                                            </div>
                                            <p className="fw-bold">{c?.comment}</p>
                                            {c.reply !== null && <p className="">Reply: {c.reply}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Comments END */}
                            {/* Reply START */}
                            <div className="bg-light p-3 rounded">
                                <h3 className="fw-bold">Leave a reply</h3>
                                <small>Your email address will not be published. Required fields are marked *</small>
                                <form className="row g-3 mt-2" onSubmit={handleCreateCommentSubmit}>
                                    <div className="col-md-6">
                                        <label className="form-label">Name *</label>
                                        <input onChange={handleCreateCommentChange} name="full_name" value={createComment.full_name} type="text" className="form-control" aria-label="First name" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Email *</label>
                                        <input onChange={handleCreateCommentChange} name="email" value={createComment.email} type="email" className="form-control" />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Write Comment *</label>
                                        <textarea onChange={handleCreateCommentChange} name="comment" value={createComment.comment} className="form-control" rows={4} />
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary">
                                            Post comment <i className="fas fa-paper-plane"></i>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}

export default Detail;
