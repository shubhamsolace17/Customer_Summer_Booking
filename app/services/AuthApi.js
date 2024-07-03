import {Component} from 'react';
import ApiServices from './ApiServices';
import ApiResponse from './ApiResponse';

export async function getDataFromServer(endPoint) {
  return ApiServices.get(endPoint).then(
    response => {
      if (response.status == 200) {
        ApiResponse.data = response.data;
        ApiResponse.paginator = response.data.paginator;
        ApiResponse.isConnected = true;
        ApiResponse.success = true;
        ApiResponse.message = null;
        return ApiResponse;
      }
      ApiResponse.data = null;
      ApiResponse.success = false;
      return ApiResponse;
    },
    err => setupErrorMessage(err),
  );
}

export async function postDataToServer(endPoint, parameter) {
  return ApiServices.post(endPoint, parameter).then(
    response => {
      if (response.status === 200) {
        ApiResponse.data = response.data;
        ApiResponse.isConnected = true;
        ApiResponse.success = response.data.success;
        ApiResponse.status = response.data.status;
        ApiResponse.message = response.data.message;
        ApiResponse.sucess = response.data.sucess;
        return ApiResponse;
      }
      ApiResponse.data = null;
      ApiResponse.success = false;
      return ApiResponse;
    },
    err => setupErrorMessage(err),
  );
}

export async function putDataToServer(endPoint, parameter) {
  return ApiServices.put(endPoint, parameter).then(
    response => {
      if (response.status === 200) {
        ApiResponse.data = response.data;
        ApiResponse.isConnected = true;
        ApiResponse.success = true;
        ApiResponse.message = null;
        return ApiResponse;
      }
      ApiResponse.data = null;
      ApiResponse.success = false;
      return ApiResponse;
    },
    err => setupErrorMessage(err),
  );
}

export async function deleteDataFromServer(endPoint) {
  return ApiServices.delete(endPoint).then(
    response => {
      if (response.status === 200) {
        ApiResponse.data = response.data;
        ApiResponse.isConnected = true;
        ApiResponse.success = true;
        ApiResponse.message = null;
        return ApiResponse;
      }
      ApiResponse.data = null;
      ApiResponse.success = false;
      return ApiResponse;
    },
    err => this.setupErrorMessage(err),
  );
}

export async function setupErrorMessage(err) {
  if (err.toJSON().message === 'Network Error') {
    ApiResponse.success = false;
    ApiResponse.isConnected = true;
    ApiResponse.data = null;
    ApiResponse.error = 'Network Error';
    return ApiResponse;
  }

  ApiResponse.message = 'Something went wrong! Please try again later.';
  if (err.response && err.response.data && err.response.data.message) {
    ApiResponse.message = err.response.data.message;
  }
  if (err.response.status === 401) {
    ApiResponse.message = 'Token expired!';
  }
  ApiResponse.success = false;
  ApiResponse.isConnected = true;
  ApiResponse.data = null;
  ApiResponse.error = err.response.data.message;
  return ApiResponse;
}
