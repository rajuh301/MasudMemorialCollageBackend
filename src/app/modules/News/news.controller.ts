import { Request, Response } from "express";
import httpStatus from "http-status";

import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";

import { NewsService } from "./news.service";

const createNews = catchAsync(async (req: Request, res: Response) => {

  const result = await NewsService.createNewsIntoDB(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "News created successfully",
    data: result,
  });

});



const getNews = catchAsync(async (req: Request, res: Response) => {

  const result = await NewsService.getNewsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "News fetched successfully",
    data: result,
  });

});



const getSingleNews = catchAsync(async (req: Request, res: Response) => {

  const { id } = req.params;

  const result = await NewsService.getSingleNewsFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Single news fetched successfully",
    data: result,
  });

});



const updateNews = catchAsync(async (req: Request, res: Response) => {

  const { id } = req.params;
  const data = req.body;

  const result = await NewsService.updateNewsIntoDB(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "News updated successfully",
    data: result,
  });

});



const deleteNews = catchAsync(async (req: Request, res: Response) => {

  const { id } = req.params;

  const result = await NewsService.deleteNewsFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "News deleted successfully",
    data: result,
  });

});



export const NewsController = {
  createNews,
  getNews,
  getSingleNews,
  updateNews,
  deleteNews
};