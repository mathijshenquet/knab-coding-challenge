import { StreamMailer, StreamMailerInit, Mail } from '../src/mailer';

describe('StreamMailer', () => {
    let mockStream: { write: jest.Mock };
    let streamMailer: StreamMailer;
    let mail: Mail;

    beforeEach(() => {
        mockStream = { write: jest.fn() };
        const init: StreamMailerInit = { from: 'test@example.com', stream: mockStream };
        streamMailer = new StreamMailer(init);
        mail = { to: 'recipient@example.com', subject: 'Test Subject', text: 'Test Text' };
    });

    it('should construct properly', () => {
        expect(streamMailer).toBeInstanceOf(StreamMailer);
    });

    it('should send an email', () => {
        streamMailer.send(mail);
        expect(mockStream.write).toHaveBeenCalledWith("From: test@example.com\n");
        expect(mockStream.write).toHaveBeenCalledWith("To: recipient@example.com\n");
        expect(mockStream.write).toHaveBeenCalledWith("Subject: Test Subject\n");
        expect(mockStream.write).toHaveBeenCalledWith("Test Text\n");
    });
});