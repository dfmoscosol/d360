import React from "react";

import { Loader, FetchError } from "@components";
import { AiFillLike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";

import {
  MdAccessTimeFilled,
  MdCheckCircle,
  MdClose,
  MdDateRange,
  MdOutlineEmojiPeople,
  MdDelete,
  MdOutlineEdit,
} from "react-icons/md";

import { useGetAllKeywordsQuery } from "@redux/services/keyword/keywordApi";

const Keywords = () => {
  const { data, error, isLoading, isFetching, isError } =
    useGetAllKeywordsQuery();

  if (isLoading || isFetching) return <Loader />;

  if (isError) return <FetchError error={error} />;

  const keywords = data.respuesta.terminos;

  console.log(keywords);

  return (
    <div className="flex flex-col items-center pb-12">
      <div className="w-[600px] bg-white rounded-lg p-4 flex flex-col">
        <span className="font-medium text-lg text-primary_color_1">
          Términos Clave
        </span>

        <div className="flex flex-col gap-2 mt-2">
          {keywords.map((keyword) => (
            <div className="bg-primary_gray_1 rounded-lg py-2 px-4 flex justify-between items-center hover:shadow-lg transition duration-200">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  {keyword.isapproved && (
                    <div className="flex items-center gap-1 bg-green-200 text-green-700 rounded-xl p-1">
                      <AiFillLike size={15} />
                    </div>
                  )}
                  <span className="font-medium text-sm text-primary_gray_3">
                    {keyword.palabra}
                  </span>
                </div>

                {/*keyword.isvalid ? (
                  <div className="flex items-center gap-1 bg-green-200 text-green-700 rounded-xl px-3 py-1">
                    <AiFillLike size={18} />
                    <span className="text-xs">Inclusión</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-red-200 text-red-700 rounded-xl px-3 py-1">
                    <AiFillDislike size={18} />
                    <span className="text-xs">Exclusión</span>
                  </div>
                )*/}
              </div>

              <div className="flex gap-2">
                <button className="rounded-full p-1 flex items-center bg-blue-100 text-blue-800">
                  {" "}
                  <MdOutlineEdit size={20} />{" "}
                </button>
                <button className="rounded-full p-1 flex items-center bg-red-100 text-red-800">
                  {" "}
                  <MdDelete size={20} />{" "}
                </button>
              </div>

              {!keyword.isapproved && (
                <div className="flex items-center gap-1 bg-green-200 text-green-700 rounded-xl px-3 py-1">
                  <AiFillLike size={18} />
                  <span className="text-xs">Aprobada</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Keywords;
