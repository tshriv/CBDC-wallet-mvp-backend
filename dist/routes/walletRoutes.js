"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const walletController_1 = require("../controllers/walletController");
const router = express_1.default.Router();
router.get('/balance', authMiddleware_1.auth, walletController_1.getBalance);
router.post('/load', authMiddleware_1.auth, walletController_1.loadFunds);
router.post('/transfer', authMiddleware_1.auth, walletController_1.transferFunds);
router.get('/transactions', authMiddleware_1.auth, walletController_1.getTransactions);
exports.default = router;
//# sourceMappingURL=walletRoutes.js.map