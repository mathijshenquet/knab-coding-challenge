/**
 * Abstract interface which allows the sending of emails
 */
export interface Mailer {
    /** Send an email */
    send: (email: Mail) => void;
}

/** The type of emails being sendable by {@link Mailer.send} */
export type Mail = { to: string; subject: string; text: string };

// A stub StreamMailer which writes emails to a writeable stream

/**
 * The arguments to construct a {@link StreamMailer}
 */
export type StreamMailerInit = {
    from: string;
    stream: { write: (input: string) => void };
};

/**
 * An stub {@link Mailer} which writes emails to a stream such as stdout.
 */
export class StreamMailer implements Mailer {
    constructor(private init: StreamMailerInit){
    }

    send(mail: Mail): void {
        let writer = this.init.stream;
        function writeln(line: string) {
            writer.write(`${line}\n`);
        }

        writeln("\n##### BEGIN EMAIL #####\n");
        writeln(`From: ${this.init.from}`);
        writeln(`To: ${mail.to}`);
        writeln(`Subject: ${mail.subject}`);
        writeln("");
        writeln(mail.text);
        writeln("\n###### END EMAIL ######\n");
    }
}