import Image from "next/image";

import { Reveal } from "@/components/animations/Reveal";
import { Container } from "@/components/ui/Container";
import { APPOINTMENT } from "@/lib/content";

const FIELD =
  "h-[50px] w-full rounded-[5px] border border-line bg-white px-[21px] text-[16px] text-navy placeholder:text-body/70 focus:border-teal focus:outline-none";

/**
 * Figma 1:254 … 1:298 — a photo on the left, a faint world map bleeding off
 * the right edge, and the booking card floating over the seam between them.
 */
export function Appointment() {
  const { form } = APPOINTMENT;

  return (
    <section
      id="appointment"
      className="relative overflow-hidden bg-white pb-[50px] pt-[64px] lg:pb-[90px] lg:pt-[120px]"
    >
      {/* Decorative map — Figma 1:256 */}
      <Image
        src={APPOINTMENT.map}
        alt=""
        width={720}
        height={360}
        aria-hidden
        className="pointer-events-none absolute right-0 top-[132px] hidden w-[720px] max-w-[45vw] opacity-60 lg:block"
      />

      <Container className="relative">
        <div className="grid gap-[50px] lg:grid-cols-[810fr_440fr] lg:items-start">
          {/* Photo, support copy and direct contacts */}
          <div>
            <Reveal>
              <Image
                src={APPOINTMENT.image}
                alt={APPOINTMENT.imageAlt}
                width={810}
                height={502}
                sizes="(max-width: 1024px) 100vw, 810px"
                className="w-full rounded-[20px] object-cover"
              />
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-[82px] max-w-[486px] text-[16px] leading-[24px] text-body">
                {APPOINTMENT.support}
              </p>

              <ul className="mt-[44px] flex list-none flex-col gap-[30px]">
                {APPOINTMENT.contacts.map((contact) => (
                  <li key={contact.id} className="flex items-start gap-[15px]">
                    <Image
                      src={contact.icon}
                      alt=""
                      width={30}
                      height={30}
                      className="mt-[3px] size-[30px] shrink-0 text-teal"
                      unoptimized
                    />
                    <div>
                      <p className="text-[15px] font-medium leading-[19px] text-navy">
                        {contact.label}
                      </p>
                      <a
                        href={contact.href}
                        className="text-[16px] leading-[20px] text-body transition-colors hover:text-teal"
                      >
                        {contact.value}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Intro and the booking card */}
          <div>
            <Reveal delay={0.05}>
              <p className="text-[16px] leading-[24px] text-body lg:max-w-[427px]">
                {APPOINTMENT.intro}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-[22px] rounded-[10px] bg-white p-[38px] shadow-[0_20px_60px_-24px_rgba(8,29,82,0.25)] lg:-ml-[90px] lg:w-[560px] lg:p-[44px] lg:shadow-[0_24px_70px_-28px_rgba(8,29,82,0.28)] xl:-ml-[200px] xl:w-[660px] xl:p-[50px]">
                <h2 className="text-[32px] leading-[44px] tracking-[-1.28px] text-navy">
                  {form.title}
                </h2>

                <form
                  className="mt-[20px] grid grid-cols-1 gap-[16px] sm:grid-cols-2"
                  action="#"
                >
                  <label className="block">
                    <span className="sr-only">{form.name}</span>
                    <input
                      type="text"
                      name="name"
                      placeholder={form.name}
                      className={FIELD}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="sr-only">{form.email}</span>
                    <input
                      type="email"
                      name="email"
                      placeholder={form.email}
                      className={FIELD}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="sr-only">{form.phone}</span>
                    <input
                      type="tel"
                      name="phone"
                      placeholder={form.phone}
                      className={FIELD}
                    />
                  </label>
                  <label className="block">
                    <span className="sr-only">Department</span>
                    <select name="department" className={FIELD} defaultValue="">
                      <option value="" disabled>
                        {form.departments[0]}
                      </option>
                      {form.departments.slice(1).map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="sr-only">Doctor</span>
                    <select name="doctor" className={FIELD} defaultValue="">
                      <option value="" disabled>
                        {form.doctors[0]}
                      </option>
                      {form.doctors.slice(1).map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="sr-only">Preferred date</span>
                    <input type="date" name="date" className={FIELD} />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className="sr-only">{form.messagePlaceholder}</span>
                    <textarea
                      name="message"
                      rows={5}
                      placeholder={form.messagePlaceholder}
                      className={`${FIELD} h-[150px] resize-none py-[14px]`}
                    />
                  </label>

                  <button
                    type="submit"
                    className="mt-[13px] h-[54px] w-full whitespace-nowrap rounded-[8px] bg-teal px-[30px] text-[16px] font-medium text-white transition-colors duration-300 hover:bg-teal-dark sm:w-auto sm:min-w-[204px]"
                  >
                    {form.submit}
                  </button>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
