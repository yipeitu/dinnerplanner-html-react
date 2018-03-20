import React from 'react';

export const ErrorMsg = () => {
    return <div className="text-center h4 text-center p-2 text-danger">Data loading failed, please try again later</div>
}

export const Loading = () => {
	return <div className="container text-center loader"></div>
}