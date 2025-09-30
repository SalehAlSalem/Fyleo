import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Viewer, Worker, ViewMode, ProgressBar } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import NavBar from "../NavBar";
import DatabaseService from "../../services/databaseService";
import classNames from "classnames";

export default function PDFViewer(){
    const { id } = useParams();
    const [fileUrl, setFileUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fileInfo, setFileInfo] = useState(null);

    useEffect(() => {
        const fetchFile = async () => {
            if (!id) {
                setError('معرف الملف غير صحيح');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const fileRef = doc(db, 'files', id);
                const fileSnap = await getDoc(fileRef);

                if (fileSnap.exists()) {
                    const fileData = fileSnap.data();
                    setFileInfo(fileData);
                    setFileUrl(fileData.downloadURL || fileData.secure_url);
                    
                    // Increment view count
                    await incrementViewCount(id);
                } else {
                    setError('الملف غير موجود');
                }
            } catch (err) {
                console.error('خطأ في جلب الملف:', err);
                setError('فشل في تحميل الملف');
            } finally {
                setLoading(false);
            }
        };

        fetchFile();
    }, [id]);

    const transform = (slot) => ({
        ...slot,
        Open: () => <></>,
        OpenMenuItem: () => <></>,
        Print: () => <></>,
        PrintMenuItem: () => <></>,
        ShowProperties: () => <></>,
        ShowPropertiesMenuItem: () => <></>,
        SwitchTheme: () => <></>,
        SwitchThemeMenuItem: () => <></>,
    });

    const renderToolbar = (Toolbar => (
        <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
    ));

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        renderToolbar,
    });
    const { renderDefaultToolbar } = defaultLayoutPluginInstance.toolbarPluginInstance;

    if (loading) {
        return (
            <>
                <NavBar/>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-lg">جاري تحميل الملف...</div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <NavBar/>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-red-500 text-lg">{error}</div>
                </div>
            </>
        );
    }

    if (!fileUrl) {
        return (
            <>
                <NavBar/>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-lg">رابط الملف غير متوفر</div>
                </div>
            </>
        );
    }

    return (
        <>
            <NavBar/>
            {fileInfo && (
                <div className="fixed top-20 left-4 bg-white p-3 rounded shadow-lg z-10 max-w-xs">
                    <h3 className="font-bold text-sm mb-1">{fileInfo.originalName || fileInfo.name}</h3>
                    <p className="text-xs text-gray-600">التصنيف: {fileInfo.category}</p>
                    <p className="text-xs text-gray-600">المشاهدات: {fileInfo.views || 0}</p>
                </div>
            )}
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.8.162/build/pdf.worker.js">
                <div className={classNames({
                    'flex justify-center w-full': true,
                })}>
                    <div className={classNames({
                        'h-[87vh] w-screen mt-20 scale-[0.96]': true,
                    })}>
                        <Viewer
                            fileUrl={fileUrl}
                            defaultScale={1}
                            plugins={[
                                defaultLayoutPluginInstance,
                            ]}
                            viewMode={(typeof window !== 'undefined' && window.innerWidth < 768) ? ViewMode.Single : ViewMode.DualPage}
                            onOpenError={(e) => {
                                console.error('خطأ في فتح الملف:', e);
                                setError('فشل في فتح الملف PDF');
                            }}
                            renderLoader={(percentages) => (
                                <div style={{ width: '240px' }} className="flex items-center justify-center">
                                    <div className="text-center">
                                        <ProgressBar progress={Math.round(percentages)} />
                                        <p className="mt-2 text-sm">جاري التحميل... {Math.round(percentages)}%</p>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </div>
            </Worker>
        </>
    );
}
