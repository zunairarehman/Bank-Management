const AuditLog = require('../models/AuditLog');

const logAudit = (action, options = {}) => async (req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode < 400) {
      AuditLog.create({
        actorType: req.admin ? 'admin' : req.user ? 'user' : 'system',
        actorId: req.admin?._id || req.user?._id,
        action,
        resource: options.resource || '',
        resourceId: options.resourceId,
        details: { path: req.path, method: req.method, ...options.details },
        ipAddress: req.ip || '',
        severity: options.severity || 'info',
      }).catch(() => {});
    }
    return originalJson(body);
  };
  next();
};

module.exports = logAudit;
