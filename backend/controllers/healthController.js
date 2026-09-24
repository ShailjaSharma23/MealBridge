import mongoose from 'mongoose';

/**
 * @desc   Check backend server & database status
 * @route  GET /api/health
 * @access Public
 */
export const getHealthStatus = (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.status(200).json({
    success: true,
    service: 'MealBridge API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    status: 'operational',
    database: {
      status: dbStatusMap[dbState] || 'unknown',
      stateCode: dbState,
    },
    environment: process.env.NODE_ENV || 'development',
  });
};
