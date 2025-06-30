import React, { useEffect, useState } from "react"
import ReactStars from "react-rating-stars-component"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, FreeMode, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"
import "swiper/css/pagination"
import { FaStar } from "react-icons/fa"
import { apiConnector } from "../../services/apiconnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const truncateWords = 15

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API)
        if (data?.success) {
          setReviews(data?.data)
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      }
    })()
  }, [])

  return (
    <div className="w-full bg-richblack-900 py-10 text-white">
      

      <div className="max-w-[1200px] mx-auto px-4">
        <Swiper
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          spaceBetween={20}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay]}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index} className="!w-[280px]">
              <div className="flex h-full flex-col justify-between gap-4 rounded-lg bg-richblack-800 p-5 shadow-md transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      review?.user?.image
                        ? review.user.image
                        : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstname} ${review?.user?.lastname}`
                    }
                    alt="User"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-richblack-5">
                      {review?.user?.firstname} {review?.user?.lastname}
                    </p>
                    <p className="text-sm text-richblack-400">{review?.course?.courseName}</p>
                  </div>
                </div>

                <p className="text-sm text-richblack-200">
                  {review.review.split(" ").length > truncateWords
                    ? review.review.split(" ").slice(0, truncateWords).join(" ") + "..."
                    : review.review}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-yellow-100 font-semibold">
                    {review.rating.toFixed(1)}
                  </span>
                  <ReactStars
                    count={5}
                    value={review.rating}
                    size={18}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}

export default ReviewSlider
