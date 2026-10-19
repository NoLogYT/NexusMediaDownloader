# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Nexus Media Downloader, please report it to us privately.

**Please do NOT create a public GitHub issue for security vulnerabilities.**

### How to Report

1. Email security concerns to: [your-email@example.com]
2. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- Acknowledgment within 48 hours
- Regular updates on the progress
- Credit in the security advisory (if desired)

## Security Considerations

### Known Limitations

1. **User Responsibility**: Users must comply with copyright laws and terms of service of content platforms
2. **No DRM Bypass**: This tool does not circumvent DRM or access controls
3. **Rate Limiting**: Implement rate limiting in production to prevent abuse
4. **File Storage**: Automatic cleanup recommended for production deployments

### Best Practices for Deployment

1. **Use HTTPS**: Always deploy with SSL/TLS in production
2. **Authentication**: Implement user authentication for production use
3. **Input Validation**: All user inputs are validated, but additional checks recommended
4. **CORS Configuration**: Restrict CORS origins to your domains only
5. **Environment Variables**: Never commit `.env` files with secrets
6. **File Cleanup**: Implement automatic cleanup of downloaded files
7. **Rate Limiting**: Use rate limiting middleware to prevent abuse
8. **Monitoring**: Set up logging and monitoring for suspicious activity

### Security Features

- ✅ Input validation on all endpoints
- ✅ Safe argument passing to yt-dlp (no shell injection)
- ✅ File path sanitization
- ✅ CORS middleware configured
- ✅ No sensitive data in logs
- ⚠️ Rate limiting (needs implementation for production)
- ⚠️ Authentication (needs implementation for production)
- ⚠️ File encryption at rest (optional, not implemented)

## Acknowledgments

We thank the security researchers and users who help keep Nexus Media Downloader secure.
