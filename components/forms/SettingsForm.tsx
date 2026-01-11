"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, SubmitHandler, Control, useFormContext, FormProvider } from "react-hook-form";
import type { SettingsForm } from "@/types/SettingsForm";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { zodResolver } from '@hookform/resolvers/zod';
import { settingsFormSchema } from '@/lib/zod';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

const COUNTRY_CODES = [
    { code: "+91", label: "+91 (IN)" },
    { code: "+1", label: "+1 (US)" },
    { code: "+44", label: "+44 (UK)" },
    { code: "+995", label: "+995 (GE)" },
    // Add more as needed
];

const defaultValues: SettingsForm = {
    locations: [],
};

function formatPhoneNumber(countryCode: string, number: string) {
    // Remove all non-digit characters
    const digits = number.replace(/\D/g, "");
    // Split into 5-5 if 10 digits
    if (digits.length === 10) {
        return `${countryCode} ${digits.slice(0, 5)} ${digits.slice(5)}`;
    }
    return `${countryCode} ${digits}`;
}

function LocationFields({ nestIndex, control, removeLocation }: {
    nestIndex: number;
    control: Control<SettingsForm>;
    removeLocation: () => void;
}) {
    const { register, watch, setValue } = useFormContext<SettingsForm>();
    const { fields: addressFields, append: appendAddress, remove: removeAddress } = useFieldArray({
        control,
        // nested field-array name - typed as any for react-hook-form limitations
        name: `locations.${nestIndex}.address` as any,
    });
    const { fields: stepFields, append: appendStep, remove: removeStep } = useFieldArray({
        control,
        name: `locations.${nestIndex}.gettingHere.steps` as any,
    });
    const { fields: phoneFields, append: appendPhone, remove: removePhone } = useFieldArray({
        control,
        name: `locations.${nestIndex}.phoneNumbers` as any,
    });
    const { fields: emailFields, append: appendEmail, remove: removeEmail } = useFieldArray({
        control,
        name: `locations.${nestIndex}.emails` as any,
    });
    const mapEmbedSrc = watch(`locations.${nestIndex}.gettingHere.mapEmbedSrc`);

    // For each phone, keep a country code in local state (for demo, could be in form state for real app)
    const phoneNumbers = watch(`locations.${nestIndex}.phoneNumbers`);
    const [countryCodes, setCountryCodes] = React.useState<string[]>(() => phoneFields.map(() => COUNTRY_CODES[0].code));
    React.useEffect(() => {
        setCountryCodes((prev) => {
            if (phoneFields.length > prev.length) {
                return [...prev, COUNTRY_CODES[0].code];
            } else if (phoneFields.length < prev.length) {
                return prev.slice(0, phoneFields.length);
            }
            return prev;
        });
    }, [phoneFields.length]);

    const emails = watch(`locations.${nestIndex}.emails`);

    // Helper to clear or remove field
    function handleRemoveOrClear(removeFn: (idx: number) => void, arr: unknown[], idx: number, clearFn: (idx: number) => void) {
        if (arr.length === 1) {
            clearFn(idx);
        } else {
            removeFn(idx);
        }
    }

    return (
        <div className="mb-8 border p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Location {nestIndex + 1}</h3>
            {/* Address Lines */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Address Lines</label>
                {addressFields.map((field, addrIdx) => (
                    <div key={field.id} className="flex gap-2 mb-2">
                        <Input
                            {...register(`locations.${nestIndex}.address.${addrIdx}` as const)}
                            placeholder={`Address line ${addrIdx + 1}`}
                        />
                        <Button type="button" variant="destructive" onClick={() => handleRemoveOrClear(removeAddress, addressFields, addrIdx, (i) => setValue(`locations.${nestIndex}.address.${i}` as const, ""))}>
                            Remove
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendAddress("")}>Add Address Line</Button>
            </div>
            {/* Getting Here Steps */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Getting Here Steps</label>
                {stepFields.map((field, stepIdx) => (
                    <div key={field.id} className="flex gap-2 mb-2">
                        <Textarea
                            {...register(`locations.${nestIndex}.gettingHere.steps.${stepIdx}` as const)}
                            placeholder={`Step ${stepIdx + 1}`}
                            rows={2}
                        />
                        <Button type="button" variant="destructive" onClick={() => handleRemoveOrClear(removeStep, stepFields, stepIdx, (i) => setValue(`locations.${nestIndex}.gettingHere.steps.${i}` as const, ""))}>
                            Remove
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendStep("")}>Add Step</Button>
            </div>
            {/* Map Embed Src with Live Preview */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Map Embed Src</label>
                <Input
                    {...register(`locations.${nestIndex}.gettingHere.mapEmbedSrc` as const)}
                    placeholder="Paste Google Maps embed src here"
                />
                {mapEmbedSrc && (
                    <div className="mt-2 border rounded overflow-hidden">
                        <iframe
                            src={mapEmbedSrc}
                            width="100%"
                            height="200"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title={`Map Preview ${nestIndex + 1}`}
                        />
                    </div>
                )}
            </div>
            {/* Phone Numbers */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Phone Numbers</label>
                {phoneFields.map((field, phoneIdx) => (
                    <div key={field.id} className="flex gap-2 mb-2 items-center">
                        <Select
                            value={countryCodes[phoneIdx] || COUNTRY_CODES[0].code}
                            onValueChange={val => {
                                const newCodes = [...countryCodes];
                                newCodes[phoneIdx] = val;
                                setCountryCodes(newCodes);
                                setValue(
                                    `locations.${nestIndex}.phoneNumbers.${phoneIdx}` as const,
                                    formatPhoneNumber(val, phoneNumbers?.[phoneIdx] || "")
                                );
                            }}
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {COUNTRY_CODES.map(opt => (
                                    <SelectItem key={opt.code} value={opt.code}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input
                            {...register(`locations.${nestIndex}.phoneNumbers.${phoneIdx}` as const)}
                            placeholder="Phone number"
                            value={phoneNumbers?.[phoneIdx] || ""}
                            onChange={e => {
                                // Remove country code from input before formatting
                                const raw = e.target.value.trim();
                                const code = countryCodes[phoneIdx] || COUNTRY_CODES[0].code;
                                let digits = raw;
                                if (raw.startsWith(code)) {
                                    digits = raw.slice(code.length).trim();
                                }
                                setValue(
                                    `locations.${nestIndex}.phoneNumbers.${phoneIdx}` as const,
                                    formatPhoneNumber(code, digits)
                                );
                            }}
                        />
                        <Button type="button" variant="destructive" onClick={() => handleRemoveOrClear(removePhone, phoneFields, phoneIdx, (i) => setValue(`locations.${nestIndex}.phoneNumbers.${i}` as const, ""))}>
                            Remove
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendPhone("")}>Add Phone Number</Button>
            </div>
            {/* Emails */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Emails</label>
                {emailFields.map((field, emailIdx) => (
                    <div key={field.id} className="flex gap-2 mb-2 items-center">
                        <Input
                            {...register(`locations.${nestIndex}.emails.${emailIdx}` as const)}
                            placeholder="Email address"
                            type="email"
                            value={emails?.[emailIdx] || ""}
                            onChange={e => setValue(`locations.${nestIndex}.emails.${emailIdx}` as const, e.target.value)}
                        />
                        <Button type="button" variant="destructive" onClick={() => handleRemoveOrClear(removeEmail, emailFields, emailIdx, (i) => setValue(`locations.${nestIndex}.emails.${i}` as const, ""))}>
                            Remove
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={() => appendEmail("")}>Add Email</Button>
            </div>
            {/* Opening Hours */}
            <div className="mb-4">
                <label className="block font-medium mb-1">Opening Hours</label>
                <Input
                    {...register(`locations.${nestIndex}.openingHours` as const)}
                    placeholder="e.g. Mon-Sun 10:00-22:00"
                />
            </div>
            <Button type="button" variant="destructive" onClick={removeLocation}>
                Remove Location
            </Button>
        </div>
    );
}

export default function SettingsForm({ initialValues }: { initialValues?: SettingsForm }) {
    const methods = useForm<SettingsForm>({
        resolver: zodResolver(settingsFormSchema),
        defaultValues: initialValues || defaultValues,
    });
    const { control, handleSubmit, reset, formState: { errors } } = methods;
    const { fields: locationFields, append: appendLocation, remove: removeLocation } = useFieldArray({
        control,
        name: "locations",
    });

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                if (data && data.locations && data.locations.length > 0) {
                    reset({ locations: data.locations });
                } else {
                    // If no locations, append one empty location
                    reset({
                        locations: [{
                            address: [""],
                            gettingHere: { steps: [""], mapEmbedSrc: "" },
                            phoneNumbers: [""],
                            emails: [""],
                            openingHours: "",
                        }]
                    });
                }
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load settings");
                setLoading(false);
            });
    }, [reset]);

    const onSubmit: SubmitHandler<SettingsForm> = async (data) => {
        setSuccess(false);
        setError(null);
        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to save settings");
            setSuccess(true);
        } catch {
            setError("Failed to save settings");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
                {success && <Alert className="mb-4">Settings saved successfully!</Alert>}
                {error && <Alert variant="destructive" className="mb-4">{error}</Alert>}
                {errors.locations && (
                    <Alert variant="destructive" className="mb-4">
                        {errors.locations.message as string}
                    </Alert>
                )}
                {locationFields.map((location, locIdx) => (
                    <LocationFields
                        key={location.id}
                        nestIndex={locIdx}
                        control={control}
                        removeLocation={() => removeLocation(locIdx)}
                    />
                ))}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        appendLocation({
                            address: [""],
                            gettingHere: { steps: [""], mapEmbedSrc: "" },
                            phoneNumbers: [""],
                            emails: [""],
                            openingHours: "",
                        })
                    }
                >
                    Add Location
                </Button>
                <Button type="submit" className="ml-4">Save</Button>
            </form>
        </FormProvider>
    );
}
