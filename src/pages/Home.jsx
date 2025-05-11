import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const Card = ({ title, content, image }) => {
  return (
    <div className="card p-5 h-96 w-96 bg-gray-400 shadow-xl flex flex-col">
      <img src={image} alt={title} className="h-48 w-full object-cover" />
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-700">{content}</p>
      <div className="card-actions justify-end">
        <button className="btn btn-primary">Read More</button>
      </div>
    </div>
  );
};

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://blog-hqx2.onrender.com/blog");
        setBlogs(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className=" mb-10 flex flex-col items-center justify-center bg-gray-200">
      <h1 className="font-bold text-3xl items-center justify-center text-center my-10">
        Blogs
      </h1>
      <div className="flex justify-center flex-wrap gap-5 ">
        {blogs.map((blog) => (
          <div key={blog._id} className=" gap-5 ">
            <Card
              title={blog.title}
              content={blog.content}
              image={blog.image}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
