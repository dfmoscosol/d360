
{
    selectedEvent && selectedEvent.tipo === 5 ? (
        <>
            <td className="py-3 text-sm font-normal text-primary_gray_4 px-2 text-center">
                <button
                    type="button"
                    onClick={() => handleDownload(item.id)}
                    className="cursor-pointer text-sm text-primary_gray_4 border border-gray-300 rounded-md py-1 px-4 bg-white hover:bg-gray-100 "
                >
                    Descargar
                </button>
            </td>
            <td className="py-3 text-sm font-normal text-primary_gray_4 px-2 text-center">
                <input
                    type="text"
                    value={item.comments}
                    onChange={(e) => handleCommentChange(startIndex + index, e.target.value)}
                    className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                    aria-label={`Comments for ${item.name}`}
                />
            </td>
            <td className="py-3 text-sm font-normal text-primary_gray_4 px-2 text-center flex justify-center items-center">
                <Button
                    type="ucuenca"
                    size="small"
                    value="Subir"
                    icon="upload"
                    onClick={() => console.log(item.id)}
                    isPrimary={true}
                    className="py-2 px-4 rounded-md flex items-center space-x-2"
                />
            </td>
        </>
    ) : (
        <>
            <td className="py-3 text-sm font-normal text-primary_gray_4 px-2 text-center">
                <Switch
                    checked={item.attended}
                    onChange={() => handleToggle(startIndex + index, "attended")}
                    className={`${item.attended ? "bg-green-500" : "bg-gray-200"} relative inline-flex items-center h-6 rounded-full w-11`}
                    aria-label={`Toggle attended for ${item.name}`}
                >
                    <span
                        className={`${item.attended ? "translate-x-6" : "translate-x-1"} inline-block w-4 h-4 transform bg-white rounded-full`}
                    />
                </Switch>
            </td>
            <td className="py-3 text-sm font-normal text-primary_gray_4 px-2 text-center">
                <Switch
                    checked={item.passed}
                    onChange={() => handleToggle(startIndex + index, "passed")}
                    className={`${item.passed ? "bg-green-500" : "bg-gray-200"} relative inline-flex items-center h-6 rounded-full w-11`}
                    aria-label={`Toggle passed for ${item.name}`}
                >
                    <span
                        className={`${item.passed ? "translate-x-6" : "translate-x-1"} inline-block w-4 h-4 transform bg-white rounded-full`}
                    />
                </Switch>
            </td>
            <td className="py-3 text-sm font-normal text-primary_gray_4 px-2 text-center">
                <input
                    type="text"
                    value={item.comments}
                    onChange={(e) => handleCommentChange(startIndex + index, e.target.value)}
                    className="focus:bg-white text-primary_gray_4 font-light p-2 rounded-lg text-sm w-full bg-primary_gray_1 outline-none focus:ring-1 focus:ring-inset focus:ring-primary_gray_5"
                    aria-label={`Comments for ${item.name}`}
                />
            </td>
        </>
    )
}