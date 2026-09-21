# Video Upload System Design

A video upload service is a good example of async work. Uploading a 4GB file is slow. Transcoding it to 4K is slower. The user should not wait on one request for both.

Start by locking the requirements. Then model the entities. Then draw the flow and the APIs.

## Requirements

Ask the questions. Write the answers down.

| Question                         | Decision                                      |
| -------------------------------- | --------------------------------------------- |
| Supported resolutions / formats? | Up to **4K**                                  |
| Size limit?                      | Max file **4GB**                              |
| How many uploads at once?        | **1,000 users**, one upload a day             |
| Thumbnails?                      | **Yes**                                       |
| Trim / edit the video?           | **No**                                        |
| Captions / subtitles?            | **Not today**                                 |
| Process audio?                   | **Yes**, as a **separate audio track**        |
| Upload-speed metrics?            | **No**                                        |

That is enough to design against. No editor. No captions. Audio is extracted, not mixed back in. Do not spend time on upload-speed dashboards.

1,000 uploads a day is a modest rate. The hard part is the **size and the processing**, not the QPS.

## Entities

```text
User
  │
  └── Video
        ├── Thumbnails
        ├── Audio
        ├── Metadata
        └── Manifest
```

| Entity          | What it is                                              |
| --------------- | ------------------------------------------------------- |
| **User**        | Who owns the upload                                     |
| **Video**       | The source file, up to 4GB, processed up to 4K          |
| **Thumbnails**  | Still images generated from the video                   |
| **Audio**       | A separate track extracted from the video               |
| **Metadata**    | Duration, resolution, owner, status                     |
| **Manifest**    | How the player finds the processed video                |

The user owns a video. Processing fills in the rest. Until processing is done, thumbnails, audio, and the manifest may not exist yet.

## Flow

Two moments matter to the user: **upload succeeded**, and **processing is complete**. Those are two different notifications. Processing is async.

```text
User
  │
  │  POST /videos     (file, up to 4GB)
  ▼
API
  │  store the file
  │  enqueue a processing job
  │
  └── /notify ────────► User     upload successful
                                 (user can leave)

                         later, async

Queue ── job ──► Worker
                   │  transcode (up to 4K)
                   │  extract audio (separate track)
                   │  generate thumbnails
                   │  write metadata + manifest
                   │
                   └── /notify ──► User     processing complete
```

1. The user **starts uploading** a video.
2. The user is **notified when the upload is successful**. The file is stored. A job is on the queue. The request is done.
3. Workers **process the video**: transcode, extract audio, generate thumbnails, write metadata and a manifest.
4. The user is **notified when processing is complete**.

Set it and forget it. The API does not transcode on the upload request. A broker holds the job. Workers pull it.

## APIs

| Endpoint         | Role                                              |
| ---------------- | ------------------------------------------------- |
| **POST /videos** | Start the upload. Store the file. Enqueue work.   |
| **/notify**      | Tell the user: upload succeeded, or processing is done. |

`POST /videos` returns after the file is in. It does not wait for 4K transcoding.

`/notify` is used twice. Once for "your upload landed." Once for "your video is ready." Those are different states. Do not collapse them into one message, or a user will think the video is playable while it is still in the queue.

## Why this is async

A 4GB upload plus 4K transcoding plus thumbnails plus a separate audio track is computationally expensive. Doing it on the request would freeze the API.

The upload path stays responsive. The expensive path is a job. That is the same pattern as the previous page: server, queue, workers.

## Summary

Scope first: 4K, 4GB, 1,000 uploads a day, thumbnails and separate audio, no editor, no captions.

A user owns a video. Processing adds thumbnails, audio, metadata, and a manifest.

`POST /videos` takes the file and notifies that the upload succeeded. Workers process later. `/notify` fires again when processing is complete.
