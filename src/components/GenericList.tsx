import { useEffect, useRef, useState } from "react";
import { defaultProfileImage } from "./Icons";

interface ListProps<T> {
    data: T[];
    searchKey: keyof T;
    imageKey?: keyof T;
    titleKey: keyof T;
    idKey: keyof T;
    fetchDetails?: (id: string) => Promise<any>;
    renderDetails?: (details: any) => JSX.Element;
}

export const GenericList = <T extends Record<string, any>>({
    data,
    searchKey,
    imageKey,
    titleKey,
    idKey,
    fetchDetails,
    renderDetails,
}: ListProps<T>) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const listRef = useRef<HTMLDivElement>(null);
    const detailsRef = useRef<HTMLDivElement>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [details, setDetails] = useState<any>(null);

    const filteredItems = selectedId
        ? data.filter((item) => item[idKey] === selectedId)
        : data.filter((item) =>
            item[searchKey].toLowerCase().includes(searchTerm.toLowerCase())
        );

    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = 0;
        }
    }, [searchTerm]);

    useEffect(() => {
        if (selectedId && fetchDetails) {
            const fetchData = async () => {
                const data = await fetchDetails(selectedId);
                setDetails(data);
            };
            fetchData();
        }
    }, [selectedId, fetchDetails]);

    useEffect(() => {
        if (detailsRef.current) {
            detailsRef.current.scrollTop = 0;
        }
    }, [details]);

    const handleClick = (id: string) => {
        setSelectedId(id);
        setSearchTerm("");
    };

    return (
        <div>
            <div className={`list-container ${selectedId ? "collapsed" : "full-height"}`} ref={listRef}>
                <input
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => {
                        setSelectedId(null);
                        setDetails(null);
                    }}
                />
                {filteredItems.length === 0 ? (
                    <p>No data found.</p>
                ) : (
                    filteredItems.map((item) => (
                        <div key={item[idKey]} className="list-item" onClick={() => handleClick(item[idKey])}>
                            <div className="list-image">
                                {imageKey && item[imageKey] ? (
                                    <img src={item[imageKey]} alt={item[titleKey]} />
                                ) : (
                                    <img src={defaultProfileImage} alt="Default" />
                                )}
                            </div>
                            <p className="list-title">{item[titleKey]}</p>
                        </div>
                    ))
                )}
            </div>

            {selectedId && details && renderDetails && (
                <div className="details-container" ref={detailsRef}>
                    {renderDetails(details)}
                </div>
            )}
        </div>
    );
};
