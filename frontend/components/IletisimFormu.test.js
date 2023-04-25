import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

test("hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);

  const header = screen.getByText(/İletişim Formu/i);
  expect(header).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  render(<IletisimFormu />);
  const kullaniciAdi = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(kullaniciAdi, "Jo");
  const errorMessage = screen.getByTestId("error-name");
  expect(errorMessage).toBeInTheDocument();
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const submitButton = screen.getByTestId("submit-button");
  userEvent.click(submitButton);

  const nameErrorMessage = screen.getByTestId("error-name");
  expect(nameErrorMessage).toBeInTheDocument();

  const surnameErrorMessage = screen.getByTestId("error-surname");
  expect(surnameErrorMessage).toBeInTheDocument();

  const emailErrorMessage = screen.getByTestId("error-email");
  expect(emailErrorMessage).toBeInTheDocument();
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const kullaniciAdi = screen.getAllByPlaceholderText(/İlhan/i);
  userEvent.type(kullaniciAdi, "Burcu");

  const kullaniciSoyadi = screen.getAllByPlaceholderText(/Mansız/i);
  userEvent.type(kullaniciSoyadi, "Deniz");

  const submitButton = screen.getByTestId("submit-button");
  userEvent.click(submitButton);

  const emailErrorMessage = screen.getByTestId("error-email");
  expect(emailErrorMessage).toBeInTheDocument();
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const kullaniciEmail = screen.getByPlaceholderText(
    /yüzyılıngolcüsü@hotmail.com/i
  );
  userEvent.type(kullaniciEmail, "mail");
  const emailErrorMessage = screen.getByTestId("error-email");
  expect(emailErrorMessage).toHaveTextContent(
    "email geçerli bir email adresi olmalıdır."
  );
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const kullaniciSoyadi = screen.getByPlaceholderText(/Mansız/i);
  userEvent.type(kullaniciSoyadi, "d");
  userEvent.clear(kullaniciSoyadi);

  const kullaniciSoyadiMessage = screen.getByTestId("error-surname");
  expect(kullaniciSoyadiMessage).toHaveTextContent("soyad gereklidir.");
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);

  const kullaniciAdi = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(kullaniciAdi, "burcu");

  const kullaniciSoyadi = screen.getByPlaceholderText(/Mansız/i);
  userEvent.type(kullaniciSoyadi, "deniz");

  const kullaniciEmail = screen.getByPlaceholderText(
    /yüzyılıngolcüsü@hotmail.com/i
  );
  userEvent.type(kullaniciEmail, "dnzzburcu@gmail.com");
  const submitButton = screen.getByTestId("submit-button");
  userEvent.click(submitButton);
  await waitFor(() => {
    const errorDiv = screen.queryAllByTestId("error");
    expect(errorDiv.length).toBe(0);
  });
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);
  const kullaniciAdi = screen.getByPlaceholderText(/İlhan/i);
  userEvent.type(kullaniciAdi, "burcu");

  const kullaniciSoyadi = screen.getByPlaceholderText(/Mansız/i);
  userEvent.type(kullaniciSoyadi, "deniz");

  const kullaniciEmail = screen.getByPlaceholderText(
    /yüzyılıngolcüsü@hotmail.com/i
  );
  userEvent.type(kullaniciEmail, "dnzzburcu@gmail.com");
  const submitButton = screen.getByTestId("submit-button");
  userEvent.click(submitButton);
  await waitFor(() => {
    const displayName = screen.getByTestId("firstnameDisplay");
    expect(displayName).toHaveTextContent("burcu");

    const displaySurname = screen.getByTestId("lastnameDisplay");
    expect(displaySurname).toHaveTextContent("deniz");

    const displayEmail = screen.getByTestId("emailDisplay");
    expect(displayEmail).toHaveTextContent("dnzzburcu@gmail.com");
  });
});
